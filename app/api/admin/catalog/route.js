import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function requireAdmin(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const client = adminClient();
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user?.email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}

async function withStock(products) {
  if (!products?.length) return [];
  const client = adminClient();
  const { data: inventory, error } = await client
    .from("commerce_inventory")
    .select("product_id,available_quantity,reserved_quantity")
    .in("product_id", products.map((p) => p.id));
  if (error) throw error;
  const stockMap = new Map((inventory || []).map((row) => [row.product_id, row]));
  return products.map((product) => {
    const row = stockMap.get(product.id);
    return {
      ...product,
      stock: row?.available_quantity ?? 0,
      reserved_stock: row?.reserved_quantity ?? 0,
    };
  });
}

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized. Administrator access is required." }, { status: 401 });
    const { data, error } = await adminClient()
      .from("commerce_products")
      .select("id,name,branch,category,description,image_url,price,discount_percent,active,created_at,updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: await withStock(data || []) });
  } catch (error) {
    console.error("[admin/catalog GET]", error);
    return NextResponse.json({ error: error.message || "Could not load catalog." }, { status: 500 });
  }
}

function clean(body, { requireStock = false } = {}) {
  const discount = Number(body.discount_percent ?? 0);
  const price = Number(body.price);
  if (!body.name?.trim()) throw new Error("Product name is required.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Price must be a valid non-negative number.");
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error("Discount must be between 0 and 100.");
  if (!["EsteeGold", "EsteeBags"].includes(body.branch)) throw new Error("Invalid branch. Choose EsteeGold or EsteeBags.");
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
      image_url: body.image_url?.trim() || null,
      price,
      discount_percent: discount,
      active: body.active !== false,
      updated_at: new Date().toISOString(),
    },
    stock,
  };
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized. Administrator access is required." }, { status: 401 });
    const body = await request.json();
    const { row, stock } = clean(body, { requireStock: true });
    const client = adminClient();
    const { data, error } = await client.from("commerce_products").insert(row).select().single();
    if (error) throw error;

    const { error: inventoryError } = await client.from("commerce_inventory").insert({
      product_id: data.id,
      available_quantity: stock,
      reserved_quantity: 0,
    });
    if (inventoryError) {
      await client.from("commerce_products").delete().eq("id", data.id);
      throw inventoryError;
    }

    return NextResponse.json({ product: { ...data, stock, reserved_stock: 0 } }, { status: 201 });
  } catch (error) {
    console.error("[admin/catalog POST]", error);
    return NextResponse.json({ error: error.message || "Could not create product." }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized. Administrator access is required." }, { status: 401 });
    const body = await request.json();
    if (!body.id) throw new Error("Product id is required.");
    const client = adminClient();

    if (Object.keys(body).every((key) => ["id", "active"].includes(key))) {
      const { data, error } = await client
        .from("commerce_products")
        .update({ active: body.active === true, updated_at: new Date().toISOString() })
        .eq("id", body.id)
        .select()
        .single();
      if (error) throw error;
      const [withCurrentStock] = await withStock([data]);
      return NextResponse.json({ product: withCurrentStock });
    }

    const { row, stock } = clean(body);
    const { data, error } = await client.from("commerce_products").update(row).eq("id", body.id).select().single();
    if (error) throw error;

    if (stock !== undefined) {
      const { data: existing } = await client.from("commerce_inventory").select("product_id").eq("product_id", body.id).maybeSingle();
      const inventoryPayload = { product_id: body.id, available_quantity: stock, updated_at: new Date().toISOString() };
      const inventoryResult = existing
        ? await client.from("commerce_inventory").update(inventoryPayload).eq("product_id", body.id)
        : await client.from("commerce_inventory").insert({ ...inventoryPayload, reserved_quantity: 0 });
      if (inventoryResult.error) throw inventoryResult.error;
    }

    const [withCurrentStock] = await withStock([data]);
    return NextResponse.json({ product: withCurrentStock });
  } catch (error) {
    console.error("[admin/catalog PATCH]", error);
    return NextResponse.json({ error: error.message || "Could not update product." }, { status: 400 });
  }
}
