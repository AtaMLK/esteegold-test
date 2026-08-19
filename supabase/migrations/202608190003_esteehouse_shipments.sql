-- EsteeHouse shipment tracking layer
create table if not exists public.commerce_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  estimated_delivery_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id)
);
create index if not exists commerce_shipments_tracking_idx on public.commerce_shipments(tracking_number);
alter table public.commerce_shipments enable row level security;
revoke all on table public.commerce_shipments from anon, authenticated;
