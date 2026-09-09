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
  return {
    ...product,
    story: `I wanted ${branch} to feel personal rather than overworked. The shape is kept clear, the material is allowed to show itself, and the small differences are part of why the piece belongs here.`,
  };
}

async function readDatabaseProducts(client, branch, ids) {
  const baseSelect = "id,name,branch,category,description,image_url,price,discount_percent,active";
  let query = client.from("commerce_products").select(`${baseSelect},story`).eq("active", true);
  if (branch) query = query.eq("branch", branch);
  if (Array.isArray(ids)) query = query.in("id", ids);
  let result = await query.order("created_at", { ascending: false });

  if (result.error && /story|column/i.test(result.error.message || "")) {
    query = client.from("commerce_products").select(baseSelect).eq("active", true);
    if (branch) query = query.eq("branch", branch);
    if (Array.isArray(ids)) query = query.in("id", ids);
    result = await query.order("created_at", { ascending: false });
  }

  if (result.error) throw result.error;
  return result.data || [];
}

export async function getProducts({ branch = null, ids = null, search = "", includeSamples = true } = {}) {
  const normalizedSearch = String(search || "").trim().toLowerCase();
  const client = getServerClient();
  const databaseProducts = (await readDatabaseProducts(client, branch, ids)).map(enrichProduct);
  const databaseIds = new Set(databaseProducts.map((product) => String(product.id)));
  const demoProducts = includeSamples
    ? sampleProducts.filter((product) => !databaseIds.has(String(product.id)))
    : [];

  return [...databaseProducts, ...demoProducts]
    .filter((product) => !branch || product.branch === branch)
    .filter((product) => !Array.isArray(ids) || ids.map(String).includes(String(product.id)))
    .filter((product) => {
      if (!normalizedSearch) return true;
      return [product.name, product.category, product.branch, product.description, product.story]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
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
