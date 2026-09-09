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
  const { data: { user }, error } = await adminClient().auth.getUser(token);
  if (error || !user?.email) return false;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(user.email.toLowerCase());
}

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const { data, error } = await adminClient().from("commerce_pricing_settings").select("eur_usd_rate,updated_at").eq("id", true).single();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load pricing settings." }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const rate = Number((await request.json()).eur_usd_rate);
    if (!Number.isFinite(rate) || rate <= 0) return NextResponse.json({ error: "EUR/USD rate must be a positive number." }, { status: 400 });
    const { data, error } = await adminClient().from("commerce_pricing_settings").upsert({ id: true, eur_usd_rate: rate, updated_at: new Date().toISOString() }).select("eur_usd_rate,updated_at").single();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not save pricing settings." }, { status: 400 });
  }
}
