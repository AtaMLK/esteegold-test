-- EsteeHouse commerce order layer
-- Apply this migration to the project's Supabase database before enabling production checkout.
create extension if not exists pgcrypto;
create table if not exists public.commerce_orders (id uuid primary key default gen_random_uuid(), order_number text not null unique, status text not null default 'pending_payment' check (status in ('pending_payment','paid','processing','shipped','delivered','canceled','payment_failed')), payment_status text not null default 'pending' check (payment_status in ('pending','success','failed','refunded')), currency char(3) not null default 'EUR', subtotal numeric(12,2) not null check (subtotal >= 0), discount_total numeric(12,2) not null default 0 check (discount_total >= 0), shipping_total numeric(12,2) not null default 0 check (shipping_total >= 0), total numeric(12,2) not null check (total >= 0), customer_snapshot jsonb not null, address_snapshot jsonb not null, terms_accepted boolean not null default false, shipping_terms_accepted boolean not null default false, terms_accepted_at timestamptz, shipping_terms_accepted_at timestamptz, created_at timestamptz not null default now(), paid_at timestamptz, updated_at timestamptz not null default now());
create table if not exists public.commerce_order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.commerce_orders(id) on delete cascade, product_id text not null, product_line text not null check (product_line in ('EsteeGold','EsteeBags')), product_name_snapshot text not null, category_snapshot text, options_snapshot jsonb not null default '{}'::jsonb, quantity integer not null check (quantity > 0), unit_list_price numeric(12,2) not null check (unit_list_price >= 0), unit_discount numeric(12,2) not null default 0 check (unit_discount >= 0), unit_final_price numeric(12,2) not null check (unit_final_price >= 0), line_total numeric(12,2) not null check (line_total >= 0), created_at timestamptz not null default now());
create table if not exists public.commerce_payments (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.commerce_orders(id) on delete cascade, provider text not null default 'iyzico', conversation_id text not null unique, token text, payment_id text, provider_status text, payment_status text not null default 'pending' check (payment_status in ('pending','success','failed','refunded')), amount numeric(12,2) not null check (amount >= 0), currency char(3) not null default 'EUR', raw_response jsonb, created_at timestamptz not null default now(), verified_at timestamptz);
create table if not exists public.commerce_inventory (product_id text primary key, available_quantity integer not null default 0 check (available_quantity >= 0), reserved_quantity integer not null default 0 check (reserved_quantity >= 0), updated_at timestamptz not null default now());
create index if not exists commerce_order_items_order_id_idx on public.commerce_order_items(order_id);
create index if not exists commerce_payments_order_id_idx on public.commerce_payments(order_id);
create index if not exists commerce_orders_created_at_idx on public.commerce_orders(created_at desc);
alter table public.commerce_orders enable row level security;
alter table public.commerce_order_items enable row level security;
alter table public.commerce_payments enable row level security;
alter table public.commerce_inventory enable row level security;

-- Development-only seed. Replace with the real inventory before launch.
insert into public.commerce_inventory (product_id, available_quantity) values ('1',10),('2',10),('3',10),('4',10),('5',10),('6',10) on conflict (product_id) do nothing;

create or replace function public.finalize_commerce_order(p_order_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order commerce_orders%rowtype; v_item commerce_order_items%rowtype; v_inventory commerce_inventory%rowtype;
begin
 select * into v_order from commerce_orders where id=p_order_id for update;
 if not found then raise exception 'ORDER_NOT_FOUND'; end if;
 if v_order.payment_status='success' and v_order.status in ('paid','processing','shipped','delivered') then return jsonb_build_object('success',true,'alreadyFinalized',true,'orderNumber',v_order.order_number); end if;
 for v_item in select * from commerce_order_items where order_id=p_order_id for update loop
  select * into v_inventory from commerce_inventory where product_id=v_item.product_id for update;
  if not found then raise exception 'INVENTORY_NOT_CONFIGURED:%',v_item.product_id; end if;
  if v_inventory.available_quantity<v_item.quantity then raise exception 'INSUFFICIENT_STOCK:%',v_item.product_id; end if;
  update commerce_inventory set available_quantity=available_quantity-v_item.quantity,reserved_quantity=reserved_quantity+v_item.quantity,updated_at=now() where product_id=v_item.product_id;
 end loop;
 update commerce_orders set status='paid',payment_status='success',paid_at=coalesce(paid_at,now()),updated_at=now() where id=p_order_id;
 return jsonb_build_object('success',true,'alreadyFinalized',false,'orderNumber',v_order.order_number);
end; $$;
revoke all on function public.finalize_commerce_order(uuid) from public;
