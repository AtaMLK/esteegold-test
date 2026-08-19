-- EsteeHouse inventory audit ledger + refund lifecycle.

create table if not exists public.commerce_inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  order_id uuid references public.commerce_orders(id) on delete set null,
  quantity_delta integer not null,
  available_delta integer not null default 0,
  reserved_delta integer not null default 0,
  reason text not null,
  actor text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists commerce_inventory_ledger_product_idx on public.commerce_inventory_ledger(product_id, created_at desc);
create index if not exists commerce_inventory_ledger_order_idx on public.commerce_inventory_ledger(order_id, created_at desc);
alter table public.commerce_inventory_ledger enable row level security;
revoke all on table public.commerce_inventory_ledger from anon, authenticated;

create or replace function public.finalize_commerce_order(p_order_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order commerce_orders%rowtype; v_item commerce_order_items%rowtype; v_inventory commerce_inventory%rowtype; v_reserved integer := 0;
begin
 select * into v_order from commerce_orders where id=p_order_id for update;
 if not found then raise exception 'ORDER_NOT_FOUND'; end if;
 if v_order.payment_status='success' and v_order.status in ('paid','processing','shipped','delivered') then return jsonb_build_object('success',true,'alreadyFinalized',true,'orderNumber',v_order.order_number); end if;
 if v_order.status in ('canceled','payment_failed') then raise exception 'ORDER_NOT_FINALIZABLE:%',v_order.status; end if;
 for v_item in select * from commerce_order_items where order_id=p_order_id order by id for update loop
  select * into v_inventory from commerce_inventory where product_id=v_item.product_id for update;
  if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%',v_item.product_id; end if;
  if v_inventory.available_quantity<v_item.quantity then raise exception 'INSUFFICIENT_STOCK:%',v_item.product_id; end if;
  update commerce_inventory set available_quantity=available_quantity-v_item.quantity,reserved_quantity=reserved_quantity+v_item.quantity,updated_at=now() where product_id=v_item.product_id;
  insert into commerce_inventory_ledger(product_id,order_id,quantity_delta,available_delta,reserved_delta,reason) values(v_item.product_id,p_order_id,-v_item.quantity,-v_item.quantity,v_item.quantity,'payment_reservation');
  v_reserved := v_reserved + v_item.quantity;
 end loop;
 update commerce_orders set status='paid',payment_status='success',paid_at=coalesce(paid_at,now()),updated_at=now() where id=p_order_id;
 return jsonb_build_object('success',true,'alreadyFinalized',false,'orderNumber',v_order.order_number,'reservedQuantity',v_reserved);
end; $$;

create or replace function public.release_commerce_order_inventory(p_order_id uuid, p_reason text default 'canceled')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order commerce_orders%rowtype; v_item commerce_order_items%rowtype; v_inventory commerce_inventory%rowtype; v_released integer := 0;
begin
 select * into v_order from commerce_orders where id=p_order_id for update;
 if not found then raise exception 'ORDER_NOT_FOUND'; end if;
 if v_order.payment_status <> 'success' then return jsonb_build_object('success',true,'released',false,'reason','no-successful-payment'); end if;
 if v_order.status in ('shipped','delivered') then raise exception 'INVENTORY_ALREADY_FULFILLED'; end if;
 for v_item in select * from commerce_order_items where order_id=p_order_id order by id for update loop
  select * into v_inventory from commerce_inventory where product_id=v_item.product_id for update;
  if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%',v_item.product_id; end if;
  if v_inventory.reserved_quantity<v_item.quantity then raise exception 'RESERVED_STOCK_MISMATCH:%',v_item.product_id; end if;
  update commerce_inventory set reserved_quantity=reserved_quantity-v_item.quantity,available_quantity=available_quantity+v_item.quantity,updated_at=now() where product_id=v_item.product_id;
  insert into commerce_inventory_ledger(product_id,order_id,quantity_delta,available_delta,reserved_delta,reason) values(v_item.product_id,p_order_id,v_item.quantity,v_item.quantity,-v_item.quantity,p_reason);
  v_released := v_released + v_item.quantity;
 end loop;
 update commerce_orders set status='canceled',payment_status=case when p_reason='refunded' then 'refunded' else payment_status end,updated_at=now() where id=p_order_id;
 return jsonb_build_object('success',true,'released',true,'quantity',v_released,'reason',p_reason);
end; $$;

create or replace function public.adjust_commerce_inventory(p_product_id text,p_delta integer,p_reason text,p_actor text default null,p_metadata jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_inventory commerce_inventory%rowtype;
begin
 if p_delta=0 then raise exception 'ZERO_INVENTORY_ADJUSTMENT'; end if;
 select * into v_inventory from commerce_inventory where product_id=p_product_id for update;
 if not found then insert into commerce_inventory(product_id,available_quantity,reserved_quantity) values(p_product_id,0,0) returning * into v_inventory; end if;
 if v_inventory.available_quantity+p_delta<0 then raise exception 'INSUFFICIENT_AVAILABLE_STOCK'; end if;
 update commerce_inventory set available_quantity=available_quantity+p_delta,updated_at=now() where product_id=p_product_id;
 insert into commerce_inventory_ledger(product_id,quantity_delta,available_delta,reserved_delta,reason,actor,metadata) values(p_product_id,p_delta,p_delta,0,p_reason,p_actor,p_metadata);
 return jsonb_build_object('success',true,'productId',p_product_id,'availableQuantity',v_inventory.available_quantity+p_delta);
end; $$;

revoke all on function public.adjust_commerce_inventory(text,integer,text,text,jsonb) from public;
