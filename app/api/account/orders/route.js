import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
async function getUser(request) { const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, ""); if (!token) return null; const { data: { user } } = await serverClient().auth.getUser(token); return user || null; }
export async function GET(request) {
  try {
    const user = await getUser(request); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const email = (user.email || "").toLowerCase(); if (!email) return NextResponse.json({ orders: [] });
    const client = serverClient();
    const { data, error } = await client.from("commerce_orders").select("id,order_number,status,payment_status,currency,subtotal,discount_total,shipping_total,total,address_snapshot,created_at,paid_at,updated_at,commerce_order_items(id,product_id,product_line,product_name_snapshot,category_snapshot,options_snapshot,quantity,unit_list_price,unit_discount,unit_final_price,line_total)").ilike("customer_snapshot->>email", email).order("created_at", { ascending: false });
    if (error) throw error;
    const ids = (data || []).map((o) => o.id); let shipments = [];
    if (ids.length) { const result = await client.from("commerce_shipments").select("order_id,carrier,tracking_number,tracking_url,shipped_at,estimated_delivery_at,delivered_at").in("order_id", ids); if (result.error) throw result.error; shipments = result.data || []; }
    return NextResponse.json({ orders: (data || []).map((o) => ({ ...o, shipment: shipments.find((s) => s.order_id === o.id) || null })) });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not load orders." }, { status: 500 }); }
}
