import { NextResponse } from "next/server";
import { createServiceClient as db, requireAdmin as admin } from "../../../_lib/server-supabase";



function clean(body) {
  if (!body.order_id) throw new Error("Order id is required.");
  const trackingUrl = String(body.tracking_url || "").trim();
  if (trackingUrl) {
    let parsed;
    try { parsed = new URL(trackingUrl); } catch { throw new Error("Tracking URL must be a valid http:// or https:// URL."); }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Tracking URL must start with http:// or https://.");
  }
  function date(value) {
    if (!value) return null;
    const timestamp = new Date(value);
    if (!Number.isFinite(timestamp.getTime())) throw new Error("Shipment dates must be valid dates.");
    return timestamp.toISOString();
  }
  const shippedAt = date(body.shipped_at), deliveredAt = date(body.delivered_at);
  if (deliveredAt && (!shippedAt || deliveredAt < shippedAt)) throw new Error("Delivery must have a shipping date and cannot precede it.");
  return {
    order_id: body.order_id,
    carrier: body.carrier?.trim() || null,
    tracking_number: body.tracking_number?.trim() || null,
    tracking_url: trackingUrl || null,
    shipped_at: shippedAt,
    estimated_delivery_at: date(body.estimated_delivery_at),
    delivered_at: deliveredAt,
    notes: body.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request) {
  try {
    if (!(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await db().from("commerce_shipments").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ shipments: data || [] });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Could not load shipments." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const row = clean(body);
    const client = db();

    const { data, error } = await client.rpc("save_commerce_shipment", { p_shipment: row });
    if (error) throw error;

    return NextResponse.json({ shipment: data });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Could not save shipment." }, { status: 400 });
  }
}
