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
  const { data: { user } } = await client.auth.getUser(token);
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return !!user?.email && allowed.includes(user.email.toLowerCase());
}

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await adminClient().from("commerce_products").select("id,name,branch,category,description,image_url,price,discount_percent,stock,active,created_at,updated_at").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data || [] });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not load catalog." }, { status: 500 }); }
}

function clean(body) {
  const discount = Number(body.discount_percent ?? 0);
  const price = Number(body.price);
  const stock = Number(body.stock ?? 0);
  if (!body.name?.trim()) throw new Error("Product name is required.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Price must be a valid non-negative number.");
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) throw new Error("Discount must be between 0 and 100.");
  if (!Number.isInteger(stock) || stock < 0) throw new Error("Stock must be a non-negative integer.");
  if (!["EsteeGold", "EsteeBags"].includes(body.branch)) throw new Error("Invalid branch.");
  return { name: body.name.trim(), branch: body.branch, category: body.category?.trim() || null, description: body.description?.trim() || null, image_url: body.image_url?.trim() || null, price, discount_percent: discount, stock, active: body.active !== false, updated_at: new Date().toISOString() };
}

export async function POST(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const row = clean(await request.json());
    const { data, error } = await adminClient().from("commerce_products").insert(row).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not create product." }, { status: 400 }); }
}

export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!body.id) throw new Error("Product id is required.");
    if (Object.keys(body).every((key) => ["id", "active"].includes(key))) {
      const { data, error } = await adminClient().from("commerce_products").update({ active: body.active === true, updated_at: new Date().toISOString() }).eq("id", body.id).select().single();
      if (error) throw error;
      return NextResponse.json({ product: data });
    }
    const row = clean(body);
    const { data, error } = await adminClient().from("commerce_products").update(row).eq("id", body.id).select().single();
    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not update product." }, { status: 400 }); }
}
