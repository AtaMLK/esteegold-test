-- EsteeHouse launch hardening: pricing repair, configurable product options, and safe demo orders.
-- Idempotent so it can repair environments where the earlier pricing/media migration was not applied.

create table if not exists public.commerce_pricing_settings (
  id boolean primary key default true check (id = true),
  eur_usd_rate numeric(12,6) not null default 1.08 check (eur_usd_rate > 0),
  updated_at timestamptz not null default now()
);

insert into public.commerce_pricing_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.commerce_pricing_settings enable row level security;
drop policy if exists "public can read pricing settings" on public.commerce_pricing_settings;
create policy "public can read pricing settings"
  on public.commerce_pricing_settings for select using (true);

alter table public.commerce_products
  add column if not exists material_options jsonb not null default '["925 Sterling Silver"]'::jsonb,
  add column if not exists size_type text not null default 'none' check (size_type in ('none','ring','bracelet','necklace')),
  add column if not exists size_options jsonb not null default '[]'::jsonb,
  add column if not exists stone_options jsonb not null default '[]'::jsonb,
  add column if not exists stone_required boolean not null default false,
  add column if not exists gold_available boolean not null default false,
  add column if not exists gold_price_eur numeric(12,2),
  add column if not exists gold_price_try numeric(12,2),
  add column if not exists customization_note text not null default '';

create table if not exists public.commerce_product_media (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.commerce_products(id) on delete cascade,
  kind text not null check (kind in ('image','video')),
  url text not null,
  storage_path text,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists commerce_product_media_product_idx
  on public.commerce_product_media(product_id, sort_order, created_at);

alter table public.commerce_product_media enable row level security;
drop policy if exists "public can read product media" on public.commerce_product_media;
create policy "public can read product media"
  on public.commerce_product_media for select using (
    exists (
      select 1 from public.commerce_products p
      where p.id = product_id and p.active = true
    )
  );

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = true;
update storage.buckets set file_size_limit = 15728640, allowed_mime_types = array['image/*','video/mp4','video/webm','video/quicktime'] where id = 'product-media';

-- Demo orders are deliberately identifiable and contain no real customer credentials.
do $$
declare
  v_product text;
  v_order_id uuid;
  v_status text;
  v_payment text;
  v_order_no text;
  v_idx integer := 0;
begin
  if exists (select 1 from public.commerce_orders where order_number = 'EH-DEMO-001') then
    return;
  end if;

  for v_status, v_payment, v_order_no in
    select * from (values
      ('pending_payment','pending','EH-DEMO-001'),
      ('paid','success','EH-DEMO-002'),
      ('processing','success','EH-DEMO-003'),
      ('shipped','success','EH-DEMO-004'),
      ('delivered','success','EH-DEMO-005'),
      ('canceled','refunded','EH-DEMO-006'),
      ('payment_failed','failed','EH-DEMO-007')
    ) as s(status,payment_status,order_number)
  loop
    v_idx := v_idx + 1;
    select id into v_product from public.commerce_products where active = true order by created_at asc limit 1 offset greatest(v_idx - 1,0);
    if v_product is null then
      select id into v_product from public.commerce_products where active = true order by created_at asc limit 1;
    end if;
    if v_product is null then
      continue;
    end if;

    insert into public.commerce_orders (
      order_number,status,payment_status,currency,subtotal,discount_total,shipping_total,total,
      customer_snapshot,address_snapshot,terms_accepted,shipping_terms_accepted,
      terms_accepted_at,shipping_terms_accepted_at,created_at,paid_at
    ) values (
      v_order_no,v_status,v_payment,'EUR',118,0,0,118,
      jsonb_build_object('fullName','Demo Customer '||v_idx,'email','demo+'||v_idx||'@example.com','phone','+90 500 000 00 0'||v_idx),
      jsonb_build_object('address','Demo address '||v_idx,'city','Istanbul','postalCode','34000','country','Turkey'),
      true,true,now(),now(),now() - make_interval(days => v_idx),case when v_payment='success' then now() - make_interval(days => v_idx) else null end
    ) returning id into v_order_id;

    insert into public.commerce_order_items (
      order_id,product_id,product_line,product_name_snapshot,category_snapshot,options_snapshot,
      quantity,unit_list_price,unit_discount,unit_final_price,line_total
    )
    select v_order_id,id,branch,name,category,
      jsonb_build_object('material','925 Sterling Silver','demo',true),
      1,coalesce(price_eur,price),0,coalesce(price_eur,price),coalesce(price_eur,price)
    from public.commerce_products where id=v_product;

    if v_payment in ('success','refunded') then
      insert into public.commerce_payments(order_id,provider,conversation_id,payment_status,amount,currency,provider_status,verified_at)
      values(v_order_id,'demo','DEMO-'||v_order_no,v_payment,118,'EUR','demo',now());
    end if;
  end loop;
end $;

insert into public.commerce_refunds(order_id,payment_id,payment_transaction_id,amount,currency,status,provider_refund_id,provider_status,reason,completed_at)
select o.id,p.id,p.payment_transaction_id,p.amount,p.currency,'success','DEMO-REFUND-006','demo','Demo refund lifecycle',now()
from public.commerce_orders o join public.commerce_payments p on p.order_id=o.id
where o.order_number='EH-DEMO-006'
on conflict (provider_refund_id) do nothing;

create table if not exists public.commerce_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete cascade,
  carrier text, tracking_number text, tracking_url text,
  shipped_at timestamptz, estimated_delivery_at timestamptz, delivered_at timestamptz,
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(order_id)
);

alter table public.commerce_shipments enable row level security;
revoke all on table public.commerce_shipments from anon, authenticated;

insert into public.commerce_shipments(order_id,carrier,tracking_number,shipped_at,estimated_delivery_at,delivered_at,notes)
select id,'Demo Express','DEMO-TRACK-004',now()-interval '2 days',now()+interval '3 days',null,'Demo shipment for admin testing.'
from public.commerce_orders where order_number='EH-DEMO-004'
on conflict(order_id) do nothing;

insert into public.commerce_shipments(order_id,carrier,tracking_number,shipped_at,estimated_delivery_at,delivered_at,notes)
select id,'Demo Express','DEMO-TRACK-005',now()-interval '10 days',now()-interval '5 days',now()-interval '6 days','Demo delivered shipment.'
from public.commerce_orders where order_number='EH-DEMO-005'
on conflict(order_id) do nothing;
