-- Refund lifecycle, transaction-level Iyzico references, and guarded order status transitions.

alter table public.commerce_payments
  add column if not exists payment_transaction_id text;

create unique index if not exists commerce_payments_transaction_id_idx
  on public.commerce_payments(provider, payment_transaction_id)
  where payment_transaction_id is not null;

create table if not exists public.commerce_refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  payment_id uuid not null references public.commerce_payments(id) on delete restrict,
  payment_transaction_id text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency char(3) not null,
  status text not null default 'pending' check (status in ('pending','success','failed')),
  provider_refund_id text,
  provider_status text,
  raw_response jsonb,
  reason text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists commerce_refunds_order_idx on public.commerce_refunds(order_id, created_at desc);
create unique index if not exists commerce_refunds_provider_refund_idx
  on public.commerce_refunds(provider_refund_id)
  where provider_refund_id is not null;
create unique index if not exists commerce_refunds_active_payment_idx
  on public.commerce_refunds(payment_id)
  where status in ('pending','success');

alter table public.commerce_refunds enable row level security;
revoke all on table public.commerce_refunds from anon, authenticated;

create or replace function public.transition_commerce_order_status(p_order_id uuid, p_new_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order commerce_orders%rowtype;
  v_allowed boolean := false;
begin
  select * into v_order from commerce_orders where id = p_order_id for update;
  if not found then raise exception 'ORDER_NOT_FOUND'; end if;
  if p_new_status = v_order.status then return jsonb_build_object('success', true, 'unchanged', true, 'status', v_order.status); end if;
  if v_order.status = 'pending_payment' and p_new_status = 'paid' and v_order.payment_status = 'success' then v_allowed := true;
  elsif v_order.status = 'paid' and p_new_status = 'processing' then v_allowed := true;
  elsif v_order.status in ('paid','processing') and p_new_status = 'shipped' then v_allowed := true;
  elsif v_order.status = 'shipped' and p_new_status = 'delivered' then v_allowed := true;
  elsif p_new_status = 'payment_failed' and v_order.status = 'pending_payment' then v_allowed := true;
  end if;
  if not v_allowed then raise exception 'INVALID_ORDER_STATUS_TRANSITION:%:%', v_order.status, p_new_status; end if;
  update commerce_orders set status = p_new_status, updated_at = now() where id = p_order_id;
  return jsonb_build_object('success', true, 'unchanged', false, 'status', p_new_status);
end;
$$;

revoke all on function public.transition_commerce_order_status(uuid,text) from public;

-- Only full refunds are supported by this workflow. Partial refunds need item-level allocation.
create or replace function public.complete_commerce_refund(p_refund_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_refund commerce_refunds%rowtype;
  v_payment commerce_payments%rowtype;
  v_order commerce_orders%rowtype;
  v_item commerce_order_items%rowtype;
  v_inventory commerce_inventory%rowtype;
  v_total_refunded numeric(12,2);
  v_released integer := 0;
begin
  select * into v_refund from commerce_refunds where id = p_refund_id for update;
  if not found then raise exception 'REFUND_NOT_FOUND'; end if;
  if v_refund.status = 'success' then return jsonb_build_object('success', true, 'alreadyCompleted', true); end if;

  select * into v_payment from commerce_payments where id = v_refund.payment_id for update;
  select * into v_order from commerce_orders where id = v_refund.order_id for update;
  if v_payment.payment_status <> 'success' then raise exception 'PAYMENT_NOT_SUCCESSFUL'; end if;
  if v_refund.amount <> v_payment.amount then raise exception 'ONLY_FULL_REFUNDS_SUPPORTED'; end if;
  if v_order.status in ('shipped','delivered') then raise exception 'INVENTORY_ALREADY_FULFILLED'; end if;

  select coalesce(sum(amount),0) into v_total_refunded from commerce_refunds where payment_id = v_refund.payment_id and status = 'success' and id <> v_refund.id;
  if v_total_refunded + v_refund.amount > v_payment.amount + 0.01 then raise exception 'REFUND_EXCEEDS_PAYMENT'; end if;

  for v_item in select * from commerce_order_items where order_id = v_order.id order by id for update loop
    select * into v_inventory from commerce_inventory where product_id = v_item.product_id for update;
    if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%', v_item.product_id; end if;
    if v_inventory.reserved_quantity < v_item.quantity then raise exception 'RESERVED_STOCK_MISMATCH:%', v_item.product_id; end if;
    update commerce_inventory set reserved_quantity = reserved_quantity - v_item.quantity, available_quantity = available_quantity + v_item.quantity, updated_at = now() where product_id = v_item.product_id;
    insert into commerce_inventory_ledger(product_id, order_id, quantity_delta, available_delta, reserved_delta, reason) values(v_item.product_id, v_order.id, v_item.quantity, v_item.quantity, -v_item.quantity, 'refund_release');
    v_released := v_released + v_item.quantity;
  end loop;

  update commerce_refunds set status = 'success', completed_at = now() where id = p_refund_id;
  update commerce_orders set status = 'canceled', payment_status = 'refunded', updated_at = now() where id = v_order.id;
  return jsonb_build_object('success', true, 'releasedQuantity', v_released);
end;
$$;

revoke all on function public.complete_commerce_refund(uuid) from public;
