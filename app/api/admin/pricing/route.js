import { NextResponse } from "next/server";
import { createServiceClient as adminClient, requireAdmin } from "../../../_lib/server-supabase";



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
