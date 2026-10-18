update public.commerce_products set size_type='one_size', size_options='["One size"]'::jsonb, updated_at=now() where product_kind='silver' and category ilike '%earring%';
