create or replace function public.save_commerce_shipment(p_shipment jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  order_id_value uuid := (p_shipment->>'order_id')::uuid;
  order_row public.commerce_orders%rowtype;
  shipment_row public.commerce_shipments%rowtype;
  shipped_value timestamptz := (p_shipment->>'shipped_at')::timestamptz;
  delivered_value timestamptz := (p_shipment->>'delivered_at')::timestamptz;
begin
  select * into order_row from public.commerce_orders where id = order_id_value for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if order_row.payment_status is distinct from 'success' or order_row.status not in ('paid','processing','shipped','delivered') then
    raise exception 'Shipment details can only be saved for successfully paid, active orders.';
  end if;
  if delivered_value is not null and (shipped_value is null or delivered_value < shipped_value) then
    raise exception 'Delivery must have a shipping date and cannot precede it.';
  end if;
  if order_row.status in ('shipped','delivered') and shipped_value is null then
    raise exception 'An already shipped order must retain its shipping date.';
  end if;
  if order_row.status = 'delivered' and delivered_value is null then
    raise exception 'An already delivered order must retain its delivery date.';
  end if;
  if shipped_value is not null and order_row.status in ('paid','processing') then
    perform public.transition_commerce_order_status(order_id_value, 'shipped');
  end if;
  if delivered_value is not null then
    perform public.transition_commerce_order_status(order_id_value, 'delivered');
  end if;
  insert into public.commerce_shipments (
    order_id, carrier, tracking_number, tracking_url, shipped_at, estimated_delivery_at, delivered_at, notes
  ) values (
    order_id_value, nullif(btrim(p_shipment->>'carrier'), ''),
    nullif(btrim(p_shipment->>'tracking_number'), ''), nullif(btrim(p_shipment->>'tracking_url'), ''),
    shipped_value, (p_shipment->>'estimated_delivery_at')::timestamptz, delivered_value,
    nullif(btrim(p_shipment->>'notes'), '')
  ) on conflict (order_id) do update set
    carrier = excluded.carrier, tracking_number = excluded.tracking_number,
    tracking_url = excluded.tracking_url, shipped_at = excluded.shipped_at,
    estimated_delivery_at = excluded.estimated_delivery_at, delivered_at = excluded.delivered_at,
    notes = excluded.notes, updated_at = now()
  returning * into shipment_row;
  return to_jsonb(shipment_row);
end;
$$;

revoke all on function public.save_commerce_shipment(jsonb) from public, anon, authenticated;
grant execute on function public.save_commerce_shipment(jsonb) to service_role;
