-- Product media gallery + regional pricing.
-- Keep the existing `price` column as the EUR legacy/base price for backward compatibility.

alter table public.commerce_products
  add column if not exists story text not null default '',
  add column if not exists price_eur numeric(12,2),
  add column if not exists price_try numeric(12,2),
  add column if not exists price_usd_override numeric(12,2),
  add column if not exists price_usd_override_enabled boolean not null default false;

update public.commerce_products
set price_eur = coalesce(price_eur, price)
where price_eur is null;

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

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = true;

create or replace function public.set_commerce_product_pricing_defaults()
returns trigger
language plpgsql
as $$
begin
  new.price_eur := coalesce(new.price_eur, new.price);
  new.price := coalesce(new.price_eur, new.price);
  return new;
end;
$$;

drop trigger if exists commerce_products_pricing_defaults on public.commerce_products;
create trigger commerce_products_pricing_defaults
before insert or update on public.commerce_products
for each row execute function public.set_commerce_product_pricing_defaults();
