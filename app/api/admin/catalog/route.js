import { NextResponse } from "next/server";
import { createServiceClient as adminClient, requireAdmin } from "../../../_lib/server-supabase";
import { normalizeProductOptions } from "../../../_lib/commerce/product-options";



async function withStock(products) {
  if (!products?.length) return [];
  const client = adminClient();
  const { data: inventory, error } = await client.from("commerce_inventory").select("product_id,available_quantity,reserved_quantity").in("product_id", products.map((p) => p.id));
  if (error) throw error;
  const stockMap = new Map((inventory || []).map((row) => [row.product_id, row]));
  return products.map((product) => {
    const row = stockMap.get(product.id);
    return { ...product, stock: row?.available_quantity ?? 0, reserved_stock: row?.reserved_quantity ?? 0 };
  });
}

async function withMedia(products) {
  if (!products?.length) return [];
  const client = adminClient();
  const { data: media, error } = await client.from("commerce_product_media").select("id,product_id,kind,url,storage_path,alt_text,sort_order,is_primary").in("product_id", products.map((p) => p.id)).order("sort_order", { ascending: true });
  if (error && /relation|commerce_product_media|does not exist/i.test(error.message || "")) return products.map((p) => ({ ...p, media: [] }));
  if (error) throw error;
  const map = new Map();
  for (const row of media || []) {
    if (!map.has(row.product_id)) map.set(row.product_id, []);
    map.get(row.product_id).push(row);
  }
  return products.map((p) => ({ ...p, media: map.get(p.id) || [] }));
}

async function enrich(products) {
  return withMedia(await withStock(products));
}

const SELECT = "id,name,branch,category,description,story,image_url,price,price_eur,price_try,price_usd_override,price_usd_override_enabled,discount_percent,active,material_options,size_type,size_options,stone_options,stone_required,gold_available,customization_note,gold_price_eur,gold_price_try,created_at,updated_at";

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized. Administrator access is required." }, { status: 401 });
    const client = adminClient();
    let { data, error } = await client.from("commerce_products").select(SELECT).order("created_at", { ascending: false });
    if (error && /price_eur|price_try|price_usd_override|gold_price_eur|gold_price_try|material_options|size_type|stone_options|column/i.test(error.message || "")) {
      const legacy = await client.from("commerce_products").select("id,name,branch,category,description,image_url,price,discount_percent,active,created_at,updated_at").order("created_at", { ascending: false });
      if (legacy.error) throw legacy.error;
      data = (legacy.data || []).map((p) => ({ ...p, material_options: [], size_type: "none", size_options: [], stone_options: [], stone_required: false, gold_available: false, customization_note: "", gold_price_eur: null, gold_price_try: null }));
    }
    if (error && !data) throw error;
    return NextResponse.json({ products: await enrich(data || []) });
  } catch (error) {
    console.error("[admin/catalog GET]", error);
    return NextResponse.json({ error: error.message || "Could not load catalog." }, { status: 500 });
  }
}

function clean(body, { requireStock = false } = {}) {
  const options = normalizeProductOptions(body);
  const discount = Number(body.discount_percent ?? 0);
  const priceEur = Number(body.price_eur ?? body.price);
  const priceTry = body.price_try === "" || body.price_try == null ? null : Number(body.price_try);
  const priceUsdOverride = body.price_usd_override === "" || body.price_usd_override == null ? null : Number(body.price_usd_override);
  const goldPriceEur = options.gold_price_eur === "" || options.gold_price_eur == null ? null : Number(options.gold_price_eur);
  const goldPriceTry = options.gold_price_try === "" || options.gold_price_try == null ? null : Number(options.gold_price_try);
  const sizeType = options.size_type;
  const materialOptions = options.material_options;
  const sizeOptions = options.size_options;
  const stoneOptions = options.stone_options;
  if (options.gold_available && !materialOptions.some((value) => /gold/i.test(value))) materialOptions.push("18K Gold");
  if (!body.name?.trim()) throw new Error("Product name is required.");
  if (!Number.isFinite(priceEur) || priceEur < 0) throw new Error("EUR price must be a valid non-negative number.");
  if (priceTry != null && (!Number.isFinite(priceTry) || priceTry < 0)) throw new Error("TRY price must be a valid non-negative number.");
  if (priceUsdOverride != null && (!Number.isFinite(priceUsdOverride) || priceUsdOverride < 0)) throw new Error("USD override must be a valid non-negative number.");
  if (goldPriceEur != null && (!Number.isFinite(goldPriceEur) || goldPriceEur < 0)) throw new Error("Gold EUR price must be a valid non-negative number.");
  if (goldPriceTry != null && (!Number.isFinite(goldPriceTry) || goldPriceTry < 0)) throw new Error("Gold TRY price must be a valid non-negative number.");
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error("Discount must be between 0 and 100.");
  if (!["EsteeGold", "EsteeBags"].includes(body.branch)) throw new Error("Invalid branch. Choose EsteeGold or EsteeBags.");
  if (sizeType !== "none" && !sizeOptions.length) throw new Error("Add at least one size option for this product.");
  if (options.stone_required && (!stoneOptions.length || stoneOptions.some((stone) => stone.name === "None"))) throw new Error("Choose at least one stone and remove None when stone selection is required.");
  if (options.gold_available && goldPriceEur == null) throw new Error("Add a gold EUR price when gold can be ordered.");
  let stock;
  if (requireStock || body.stock !== undefined) {
    stock = Number(body.stock ?? 0);
    if (!Number.isInteger(stock) || stock < 0) throw new Error("Stock must be a non-negative integer.");
  }
  return {
    row: {
      name: body.name.trim(),
      branch: body.branch,
      category: body.category?.trim() || "Uncategorized",
      description: body.description?.trim() || "",
      story: body.story?.trim() || "",
      image_url: body.image_url?.trim() || null,
      price: priceEur,
      price_eur: priceEur,
      price_try: priceTry,
      price_usd_override: priceUsdOverride,
      price_usd_override_enabled: body.price_usd_override_enabled === true,
      discount_percent: discount,
      active: body.active !== false,
      material_options: materialOptions,
      size_type: sizeType,
      size_options: sizeOptions,
      stone_options: stoneOptions,
      stone_required: options.stone_required,
      gold_available: options.gold_available,
      customization_note: body.customization_note?.trim() || "",
      gold_price_eur: goldPriceEur,
      gold_price_try: goldPriceTry,
      updated_at: new Date().toISOString(),
    },
    stock,
  };
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const { row, stock } = clean(await request.json(), { requireStock: true });
    const client = adminClient();
    const { data, error } = await client.from("commerce_products").insert({ id: crypto.randomUUID(), ...row }).select().single();
    if (error) throw error;
    const { error: inventoryError } = await client.from("commerce_inventory").insert({ product_id: data.id, available_quantity: stock, reserved_quantity: 0 });
    if (inventoryError) { await client.from("commerce_products").delete().eq("id", data.id); throw inventoryError; }
    return NextResponse.json({ product: { ...data, stock, reserved_stock: 0, media: [] } }, { status: 201 });
  } catch (error) {
    console.error("[admin/catalog POST]", error);
    return NextResponse.json({ error: error.message || "Could not create product." }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    if (!body.id) throw new Error("Product id is required.");
    if (body.stock !== undefined) return NextResponse.json({ error: "Use Inventory adjustments to change stock safely and preserve the audit history." }, { status: 409 });
    const client = adminClient();
    if (Object.keys(body).every((key) => ["id", "active"].includes(key))) {
      if (typeof body.active !== "boolean") throw new Error("Choose whether this product is active.");
      const { data, error } = await client.from("commerce_products").update({ active: body.active === true, updated_at: new Date().toISOString() }).eq("id", body.id).select().single();
      if (error) throw error;
      const [product] = await enrich([data]);
      return NextResponse.json({ product });
    }
    const { row } = clean(body);
    const { data, error } = await client.from("commerce_products").update(row).eq("id", body.id).select().single();
    if (error) throw error;
    const [product] = await enrich([data]);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("[admin/catalog PATCH]", error);
    return NextResponse.json({ error: error.message || "Could not update product." }, { status: 400 });
  }
}
