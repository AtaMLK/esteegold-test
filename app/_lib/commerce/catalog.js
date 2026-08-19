import { createClient } from "@supabase/supabase-js";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getProducts({ branch = null, ids = null } = {}) {
  const client = getServerClient();
  let query = client.from("commerce_products").select("id,name,branch,category,description,image_url,price,discount_percent,active").eq("active", true);
  if (branch) query = query.eq("branch", branch);
  if (Array.isArray(ids)) query = query.in("id", ids);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProductMap(ids) {
  const products = await getProducts({ ids });
  const map = new Map(products.map((product) => [String(product.id), product]));
  if (map.size !== ids.length) {
    const missing = ids.filter((id) => !map.has(String(id)));
    throw new Error(`Unknown or inactive product: ${missing.join(", ")}`);
  }
  return map;
}

export function priceForProduct(product) {
  const listPrice = Number(product.price);
  const discountPercent = Number(product.discount_percent || 0);
  const discount = Math.round(listPrice * discountPercent) / 100;
  const finalPrice = Math.max(0, Math.round((listPrice - discount) * 100) / 100);
  return { listPrice, discountPercent, unitDiscount: discount, finalPrice };
}
