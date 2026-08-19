-- Payment integrity constraints.
-- Apply after the commerce order migration.

-- A provider payment id must never belong to two payment records.
create unique index if not exists commerce_payments_provider_payment_id_idx
  on public.commerce_payments(provider, payment_id)
  where payment_id is not null;

-- A payment amount must match its order total. This is a database invariant,
-- not something the browser is trusted to enforce.
create or replace function public.validate_commerce_payment_amount()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_total numeric(12,2);
begin
  select total into v_total from public.commerce_orders where id = new.order_id;
  if v_total is null then raise exception 'ORDER_NOT_FOUND'; end if;
  if abs(new.amount - v_total) > 0.01 then raise exception 'PAYMENT_AMOUNT_MISMATCH'; end if;
  return new;
end;
$$;

drop trigger if exists commerce_payment_amount_guard on public.commerce_payments;
create trigger commerce_payment_amount_guard
before insert or update of amount, order_id on public.commerce_payments
for each row execute function public.validate_commerce_payment_amount();

revoke all on function public.validate_commerce_payment_amount() from public;
