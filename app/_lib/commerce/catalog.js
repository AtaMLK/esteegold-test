import { createClient } from "@supabase/supabase-js";
import { sampleProducts } from "./sample-products";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function enrichProduct(product) {
  if (product.story) return product;
  const branch = product.branch === "EsteeGold" ? "the jewelry" : "the bag";
  return { ...product, story: `I wanted ${branch} to feel personal rather than overworked. The shape is kept clear, the material is allowed to show itself, and the small differences are part of why the piece belongs here.` };
}

async function readDatabaseProducts(client, branch, ids) {
  const baseSelect = "id,name,branch,category,description,image_url,price,price_eur,price_try,price_usd_override,price_usd_override_enabled,discount_percent,active";
  let query = client.from("commerce_products").select(`${baseSelect},story`).eq("active", true);
  if (branch) query = query.eq("branch", branch);
  if (Array.isArray(ids)) query = query.in("id", ids);
  let result = await query.order("created_at", { ascending: false });

  if (result.error) {
    const legacySelect = "id,name,branch,category,description,image_url,price,discount_percent,active";
    let legacyQuery = client.from("commerce_products").select(legacySelect).eq("active", true);
    if (branch) legacyQuery = legacyQuery.eq("branch", branch);
    if (Array.isArray(ids)) legacyQuery = legacyQuery.in("id", ids);
    const legacyResult = await legacyQuery.order("created_at", { ascending: false });
    if (legacyResult.error) throw legacyResult.error;
    return legacyResult.data || [];
  }
  return result.data || [];
}

async function readMedia(client, productIds) {
  if (!productIds.length) return new Map();
  try {
    const { data, error } = await client.from("commerce_product_media").select("id,product_id,kind,url,storage_path,alt_text,sort_order,is_primary").in("product_id", productIds).order("sort_order", { ascending: true });
    if (error) return new Map();
    const map = new Map();
    for (const row of data || []) {
      if (!map.has(String(row.product_id))) map.set(String(row.product_id), []);
      map.get(String(row.product_id)).push(row);
    }
    return map;
  } catch { return new Map(); }
}

async function readPricingSettings(client) {
  try {
    const { data, error } = await client.from("commerce_pricing_settings").select("eur_usd_rate").eq("id", true).maybeSingle();
    if (error || !data) return { eur_usd_rate: 1.08 };
    return data;
  } catch { return { eur_usd_rate: 1.08 }; }
}

export async function getProducts({ branch = null, ids = null, search = "", includeSamples = true } = {}) {
  const normalizedSearch = String(search || "").trim().toLowerCase();
  const client = getServerClient();
  const databaseProducts = (await readDatabaseProducts(client, branch, ids)).map(enrichProduct);
  const databaseIds = new Set(databaseProducts.map((product) => String(product.id)));
  const demoProducts = includeSamples ? sampleProducts.filter((product) => !databaseIds.has(String(product.id))) : [];
  const products = [...databaseProducts, ...demoProducts]
    .filter((product) => !branch || product.branch === branch)
    .filter((product) => !Array.isArray(ids) || ids.map(String).includes(String(product.id)))
    .filter((product) => !normalizedSearch || [product.name, product.category, product.branch, product.description, product.story].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearch)));

  const media = await readMedia(client, databaseProducts.map((p) => String(p.id)));
  const settings = await readPricingSettings(client);
  return products.map((product) => {
    const eur = Number(product.price_eur ?? product.price ?? 0);
    const tryPrice = Number(product.price_try ?? 0);
    const usd = product.price_usd_override_enabled && product.price_usd_override != null ? Number(product.price_usd_override) : eur * Number(settings.eur_usd_rate || 1.08);
    return { ...product, price_eur: Number(eur.toFixed(2)), price_try: tryPrice > 0 ? Number(tryPrice.toFixed(2)) : null, price_usd: Number(usd.toFixed(2)), media: media.get(String(product.id)) || product.media || [], pricing_rate_eur_usd: Number(settings.eur_usd_rate || 1.08) };
  });
}

export async function getProductMap(ids) {
  const requestedIds = ids.map(String);
  const products = await getProducts({ ids: requestedIds, includeSamples: false });
  const map = new Map(products.map((product) => [String(product.id), product]));
  if (map.size !== requestedIds.length) {
    const missing = requestedIds.filter((id) => !map.has(id));
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
