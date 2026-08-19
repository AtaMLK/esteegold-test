-- EsteeHouse catalog source of truth.
-- Replace the seed rows with the final products; do not use client-side prices as authority.
create table if not exists public.commerce_products (
  id text primary key,
  name text not null,
  branch text not null check (branch in ('EsteeGold','EsteeBags')),
  category text not null,
  description text not null default '',
  image_url text,
  price numeric(12,2) not null check (price >= 0),
  discount_percent numeric(5,2) not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists commerce_products_branch_idx on public.commerce_products(branch) where active = true;
create index if not exists commerce_products_category_idx on public.commerce_products(category) where active = true;

alter table public.commerce_products enable row level security;
drop policy if exists "public can read active products" on public.commerce_products;
create policy "public can read active products" on public.commerce_products for select using (active = true);

insert into public.commerce_products (id,name,branch,category,description,image_url,price,discount_percent)
values
('1','Essential Ring','EsteeGold','Rings','A refined everyday ring.','/images/Products-page/Ring.jpg',69,0),
('2','Layered Set','EsteeGold','Sets','A layered jewelry combination.','/images/Products-page/Combinations.jpg',118,0),
('3','Statement Earrings','EsteeGold','Earrings','A statement pair with character.','/images/Products-page/Earrings.jpg',48,0),
('4','Hand Combination','EsteeGold','Bracelets','A distinctive hand combination.','/images/Products-page/hand combinations.jpg',92,0),
('5','Classic Earrings','EsteeGold','Earrings','A classic everyday pair.','/images/Products-page/Earrings-2.jpg',39.99,0),
('6','Everyday Bracelet','EsteeGold','Bracelets','A simple everyday bracelet.','/images/Products-page/Bracelets.jpg',59,0)
on conflict (id) do update set name=excluded.name,branch=excluded.branch,category=excluded.category,description=excluded.description,image_url=excluded.image_url,price=excluded.price,updated_at=now();

-- EsteeBags rows are intentionally not invented: add real bag products through admin/catalog migration when photography and pricing are ready.
