-- Demo/local retail prices. These are placeholders and are intentionally editable in Admin Catalog.
update public.commerce_products set price_eur = price, price_try = case id
  when '1' then 2850 when '2' then 4200 when '3' then 2250 when '4' then 4100 when '5' then 1650 when '6' then 3350
  when 'demo-01' then 3150 when 'demo-02' then 3650 when 'demo-03' then 3350 when 'demo-04' then 4650 when 'demo-05' then 4150
  when 'demo-06' then 4450 when 'demo-07' then 2750 when 'demo-08' then 3450 when 'demo-09' then 3850 when 'demo-10' then 3550
  when 'demo-11' then 4950 when 'demo-12' then 5250 when 'demo-13' then 5550 when 'demo-14' then 3050 when 'demo-15' then 5850
  when 'demo-16' then 5150 when 'demo-17' then 3950 when 'demo-18' then 2450 when 'demo-19' then 4750 when 'demo-20' then 6350
  else price_try end
where price_try is null or id like 'demo-%' or id in ('1','2','3','4','5','6');
