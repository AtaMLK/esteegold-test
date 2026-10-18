alter table public.commerce_products
  add column if not exists story text not null default '',
  add column if not exists price_eur numeric(12,2),
  add column if not exists price_try numeric(12,2),
  add column if not exists price_usd_override numeric(12,2),
  add column if not exists price_usd_override_enabled boolean not null default false,
  add column if not exists material_options jsonb not null default '[]'::jsonb,
  add column if not exists size_type text not null default 'none' check (size_type in ('none','ring','bracelet','necklace')),
  add column if not exists size_options jsonb not null default '[]'::jsonb,
  add column if not exists stone_options jsonb not null default '[]'::jsonb,
  add column if not exists stone_required boolean not null default false,
  add column if not exists gold_available boolean not null default false,
  add column if not exists gold_price_eur numeric(12,2) check (gold_price_eur >= 0),
  add column if not exists gold_price_try numeric(12,2) check (gold_price_try >= 0),
  add column if not exists customization_note text not null default '';

update public.commerce_products set price_eur = price where price_eur is null;
update public.commerce_products
set image_url = '/images/Products-page/hand Combinations.jpg'
where image_url = '/images/Products-page/hand combinations.jpg';

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
create policy "public can read product media" on public.commerce_product_media
for select to anon, authenticated using (
  exists (select 1 from public.commerce_products as product
    where product.id = product_id and product.active = true)
);

create table if not exists public.commerce_pricing_settings (
  id boolean primary key default true check (id = true),
  eur_usd_rate numeric(12,6) not null default 1.08 check (eur_usd_rate > 0),
  updated_at timestamptz not null default now()
);
insert into public.commerce_pricing_settings (id) values (true) on conflict (id) do nothing;
alter table public.commerce_pricing_settings enable row level security;
drop policy if exists "public can read pricing settings" on public.commerce_pricing_settings;
create policy "public can read pricing settings" on public.commerce_pricing_settings
for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 15728640,
  array['image/*','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.set_commerce_product_pricing_defaults()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.price_eur := coalesce(new.price_eur, new.price);
  new.price := coalesce(new.price_eur, new.price);
  return new;
end;
$$;
drop trigger if exists commerce_products_pricing_defaults on public.commerce_products;
create trigger commerce_products_pricing_defaults before insert or update
on public.commerce_products for each row execute function public.set_commerce_product_pricing_defaults();

revoke all on function public.finalize_commerce_order(uuid),
  public.validate_commerce_payment_amount(),
  public.release_commerce_order_inventory(uuid,text),
  public.set_commerce_order_status(uuid,text),
  public.adjust_commerce_inventory(text,integer,text,text,jsonb),
  public.transition_commerce_order_status(uuid,text),
  public.complete_commerce_refund(uuid),
  public.set_commerce_product_pricing_defaults() from public, anon, authenticated;
grant execute on function public.finalize_commerce_order(uuid),
  public.validate_commerce_payment_amount(),
  public.release_commerce_order_inventory(uuid,text),
  public.set_commerce_order_status(uuid,text),
  public.adjust_commerce_inventory(text,integer,text,text,jsonb),
  public.transition_commerce_order_status(uuid,text),
  public.complete_commerce_refund(uuid),
  public.set_commerce_product_pricing_defaults() to service_role;

drop policy if exists "read order " on public.orders;
drop policy if exists "order all" on public.orders;
drop policy if exists "all " on public.ordered_items;
revoke all on public.orders, public.ordered_items from public, anon, authenticated;
grant all on public.orders, public.ordered_items to service_role;

do $$
declare private_table record;
begin
  for private_table in
    select tablename from pg_catalog.pg_tables where schemaname = 'public'
      and tablename like 'commerce_%'
      and tablename not in ('commerce_products','commerce_product_media','commerce_pricing_settings')
  loop
    execute format('revoke all on table public.%I from public, anon, authenticated', private_table.tablename);
    execute format('grant all on table public.%I to service_role', private_table.tablename);
  end loop;
end;
$$;

revoke all on public.commerce_products, public.commerce_product_media,
  public.commerce_pricing_settings from public, anon, authenticated;
grant select on public.commerce_products, public.commerce_product_media,
  public.commerce_pricing_settings to anon, authenticated;
grant all on public.commerce_products, public.commerce_product_media,
  public.commerce_pricing_settings to service_role;
