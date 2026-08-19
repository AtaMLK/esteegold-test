-- EsteeHouse payment hardening
-- Apply after 202608190001_esteehouse_orders.sql.

-- A payment record must be unique per order/provider/conversation.
create unique index if not exists commerce_payments_order_provider_idx
  on public.commerce_payments(order_id, provider);

-- The finalization function is intentionally idempotent and locks the order/inventory rows.
create or replace function public.finalize_commerce_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order commerce_orders%rowtype;
  v_item commerce_order_items%rowtype;
  v_inventory commerce_inventory%rowtype;
  v_reserved integer;
begin
  select * into v_order from commerce_orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;

  -- A successful payment may be retried by iyzico/browser callbacks. Never reserve twice.
  if v_order.payment_status = 'success'
     and v_order.status in ('paid','processing','shipped','delivered') then
    return jsonb_build_object('success', true, 'alreadyFinalized', true, 'orderNumber', v_order.order_number);
  end if;

  if v_order.status in ('canceled','payment_failed') then
    raise exception 'ORDER_NOT_FINALIZABLE:%', v_order.status;
  end if;

  for v_item in select * from commerce_order_items where order_id = p_order_id order by id for update loop
    select * into v_inventory from commerce_inventory where product_id = v_item.product_id for update;
    if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%', v_item.product_id; end if;
    if v_inventory.available_quantity < v_item.quantity then
      raise exception 'INSUFFICIENT_STOCK:%', v_item.product_id;
    end if;

    update commerce_inventory
      set available_quantity = available_quantity - v_item.quantity,
          reserved_quantity = reserved_quantity + v_item.quantity,
          updated_at = now()
      where product_id = v_item.product_id;
  end loop;

  update commerce_orders
    set status = 'paid', payment_status = 'success', paid_at = coalesce(paid_at, now()), updated_at = now()
    where id = p_order_id;

  return jsonb_build_object('success', true, 'alreadyFinalized', false, 'orderNumber', v_order.order_number);
end;
$$;

revoke all on function public.finalize_commerce_order(uuid) from public;
