-- EsteeHouse inventory lifecycle.
-- Apply after 202608190001_esteehouse_orders.sql and payment hardening migrations.

create or replace function public.release_commerce_order_inventory(p_order_id uuid, p_reason text default 'canceled')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order commerce_orders%rowtype;
  v_item commerce_order_items%rowtype;
  v_inventory commerce_inventory%rowtype;
  v_released integer := 0;
begin
  select * into v_order from commerce_orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;

  -- Only paid/reserved orders can release reserved stock.
  if v_order.payment_status <> 'success' then
    return jsonb_build_object('success', true, 'released', false, 'reason', 'no-successful-payment');
  end if;

  if v_order.status in ('shipped','delivered') then
    raise exception 'INVENTORY_ALREADY_FULFILLED';
  end if;

  for v_item in select * from commerce_order_items where order_id = p_order_id order by id for update loop
    select * into v_inventory from commerce_inventory where product_id = v_item.product_id for update;
    if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%', v_item.product_id; end if;
    if v_inventory.reserved_quantity < v_item.quantity then
      raise exception 'RESERVED_STOCK_MISMATCH:%', v_item.product_id;
    end if;

    update commerce_inventory
      set reserved_quantity = reserved_quantity - v_item.quantity,
          available_quantity = available_quantity + v_item.quantity,
          updated_at = now()
      where product_id = v_item.product_id;
    v_released := v_released + v_item.quantity;
  end loop;

  update commerce_orders
    set status = case when p_reason = 'refunded' then 'canceled' else 'canceled' end,
        payment_status = case when p_reason = 'refunded' then 'refunded' else payment_status end,
        updated_at = now()
    where id = p_order_id;

  return jsonb_build_object('success', true, 'released', true, 'quantity', v_released, 'reason', p_reason);
end;
$$;

create or replace function public.set_commerce_order_status(p_order_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_order commerce_orders%rowtype;
begin
  select * into v_order from commerce_orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;

  if p_status not in ('pending_payment','paid','processing','shipped','delivered','canceled','payment_failed') then
    raise exception 'INVALID_ORDER_STATUS';
  end if;

  if p_status = 'canceled' then
    if v_order.status in ('shipped','delivered') then raise exception 'ORDER_ALREADY_FULFILLED'; end if;
    if v_order.payment_status = 'success' then
      return public.release_commerce_order_inventory(p_order_id, 'canceled');
    end if;
  end if;

  if p_status = 'processing' and v_order.status not in ('paid','processing') then raise exception 'INVALID_STATUS_TRANSITION'; end if;
  if p_status = 'shipped' and v_order.status not in ('paid','processing','shipped') then raise exception 'INVALID_STATUS_TRANSITION'; end if;
  if p_status = 'delivered' and v_order.status not in ('shipped','delivered') then raise exception 'INVALID_STATUS_TRANSITION'; end if;

  update commerce_orders set status = p_status, updated_at = now() where id = p_order_id;
  return jsonb_build_object('success', true, 'status', p_status);
end;
$$;

revoke all on function public.release_commerce_order_inventory(uuid,text) from public;
revoke all on function public.set_commerce_order_status(uuid,text) from public;
