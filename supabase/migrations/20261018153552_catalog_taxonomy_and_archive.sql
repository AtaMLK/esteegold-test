create table public.commerce_branches (
  name text primary key check (length(btrim(name)) between 1 and 60),
  product_kind text not null default 'other' check (product_kind in ('bag','silver','other')),
  deleted_at timestamptz
);
create unique index commerce_branches_name_ci on public.commerce_branches(lower(name));
create table public.commerce_categories (
  branch text not null references public.commerce_branches(name),
  name text not null check (length(btrim(name)) between 1 and 80),
  deleted_at timestamptz,
  primary key (branch,name)
);
create unique index commerce_categories_name_ci on public.commerce_categories(branch,lower(name));
alter table public.commerce_branches enable row level security;
alter table public.commerce_categories enable row level security;
revoke all on public.commerce_branches, public.commerce_categories from anon, authenticated;
grant select on public.commerce_branches, public.commerce_categories to anon, authenticated;
grant all on public.commerce_branches, public.commerce_categories to service_role;
create policy branches_public_read on public.commerce_branches for select to anon, authenticated using (deleted_at is null);
create policy categories_public_read on public.commerce_categories for select to anon, authenticated using (deleted_at is null);
insert into public.commerce_branches(name,product_kind) values ('EsteeBags','bag'),('EsteeGold','silver');
insert into public.commerce_branches(name,product_kind)
select distinct branch,'other' from public.commerce_products on conflict(name) do nothing;
update public.commerce_products set category='Uncategorized' where category is null or btrim(category)='';
insert into public.commerce_categories(branch,name) select distinct branch,category from public.commerce_products;
alter table public.commerce_products add column deleted_at timestamptz, add column product_kind text not null default 'other' check(product_kind in ('bag','silver','other'));
update public.commerce_products set product_kind=case branch when 'EsteeGold' then 'silver' when 'EsteeBags' then 'bag' else 'other' end;
alter table public.commerce_products drop constraint commerce_products_branch_check;
alter table public.commerce_products add constraint commerce_products_branch_fkey foreign key(branch) references public.commerce_branches(name);
alter table public.commerce_products add constraint commerce_products_category_fkey foreign key(branch,category) references public.commerce_categories(branch,name);
create index commerce_products_taxonomy_live_idx on public.commerce_products(branch,category) where deleted_at is null;
alter table public.commerce_order_items drop constraint commerce_order_items_product_line_check;
alter table public.commerce_order_items add constraint commerce_order_items_product_line_check check(length(btrim(product_line)) between 1 and 60);
alter table public.commerce_products drop constraint commerce_products_size_type_check;
alter table public.commerce_products add constraint commerce_products_size_type_check check(size_type in ('none','one_size','ring','bracelet','necklace'));
update public.commerce_products set material_options='["925 Silver","14K Gold Plated"]'::jsonb
where product_kind='silver' and (material_options is null or material_options='[]'::jsonb);
update public.commerce_products set size_type='ring',size_options='["48","50","52","54","56","58","60","62"]'::jsonb
where product_kind='silver' and category ilike '%ring%' and (size_options is null or size_options='[]'::jsonb);
update public.commerce_products set size_type='bracelet',size_options='["16 cm","17 cm","18 cm","19 cm","20 cm","21 cm","22 cm"]'::jsonb
where product_kind='silver' and category ilike '%bracelet%' and (size_options is null or size_options='[]'::jsonb);
update public.commerce_products set size_type='necklace',size_options='["40 cm","45 cm","50 cm","55 cm","60 cm","75 cm"]'::jsonb
where product_kind='silver' and (category ilike '%necklace%' or category ilike '%pendant%') and (size_options is null or size_options='[]'::jsonb);
update public.commerce_products set size_type='one_size',size_options='["One size"]'::jsonb
where product_kind='silver' and category ilike '%earring%' and (size_options is null or size_options='[]'::jsonb);
create function public.validate_product_taxonomy() returns trigger language plpgsql security invoker set search_path='' as $$
declare branch_kind text;
begin
  if new.deleted_at is not null then new.active := false; return new; end if;
  select product_kind into branch_kind from public.commerce_branches where name=new.branch and deleted_at is null for share;
  if not found then raise exception 'Choose an available branch.'; end if;
  perform 1 from public.commerce_categories where branch=new.branch and name=new.category and deleted_at is null for share;
  if not found then raise exception 'Choose an available category in this branch.'; end if;
  new.product_kind := branch_kind;
  return new;
end;
$$;
revoke execute on function public.validate_product_taxonomy() from public, anon, authenticated;
grant execute on function public.validate_product_taxonomy() to service_role;
create trigger validate_product_taxonomy before insert or update of branch,category,deleted_at,active on public.commerce_products for each row execute function public.validate_product_taxonomy();
create function public.archive_catalog_taxonomy(item_kind text, branch_name text, category_name text default null)
returns void language plpgsql security invoker set search_path='' as $$
begin
  perform 1 from public.commerce_branches where name=branch_name and deleted_at is null for update;
  if not found then raise exception 'Branch not found.'; end if;
  if item_kind='branch' then
    if exists(select 1 from public.commerce_products where branch=branch_name and deleted_at is null) then
      raise exception 'Move or remove every product in this branch first, including hidden products.';
    end if;
    update public.commerce_categories set deleted_at=now() where branch=branch_name and deleted_at is null;
    update public.commerce_branches set deleted_at=now() where name=branch_name;
  elsif item_kind='category' then
    perform 1 from public.commerce_categories where branch=branch_name and name=category_name and deleted_at is null for update;
    if not found then raise exception 'Category not found.'; end if;
    if exists(select 1 from public.commerce_products where branch=branch_name and category=category_name and deleted_at is null) then
      raise exception 'Move or remove every product in this category first, including hidden products.';
    end if;
    update public.commerce_categories set deleted_at=now() where branch=branch_name and name=category_name;
  else raise exception 'Invalid taxonomy type.';
  end if;
end;
$$;
revoke execute on function public.archive_catalog_taxonomy(text,text,text) from public,anon,authenticated;
grant execute on function public.archive_catalog_taxonomy(text,text,text) to service_role;
alter policy "public can read active products" on public.commerce_products using (active=true and deleted_at is null);
