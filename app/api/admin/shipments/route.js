import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function admin(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const { data: { user } } = await db().auth.getUser(token);
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  return !!user?.email && allowed.includes(user.email.toLowerCase());
}

function clean(body) {
  if (!body.order_id) throw new Error("Order id is required.");
  if (body.tracking_url && !/^https?:\/\//i.test(body.tracking_url)) throw new Error("Tracking URL must start with http:// or https://.");
  return {
    order_id: body.order_id,
    carrier: body.carrier?.trim() || null,
    tracking_number: body.tracking_number?.trim() || null,
    tracking_url: body.tracking_url?.trim() || null,
    shipped_at: body.shipped_at || null,
    estimated_delivery_at: body.estimated_delivery_at || null,
    delivered_at: body.delivered_at || null,
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

    const { data: data, error } = await client
      .from("commerce_shipments")
      .upsert(row, { onConflict: "order_id" })
      .select()
      .single();
    if (error) throw error;

    // Never mutate order status directly. The database transition function prevents
    // impossible lifecycle jumps such as pending_payment -> delivered.
    if (row.delivered_at) {
      const { error: transitionError } = await client.rpc("transition_commerce_order_status", {
        p_order_id: row.order_id,
        p_new_status: "delivered",
      });
      if (transitionError) throw transitionError;
    } else if (row.shipped_at) {
      const { error: transitionError } = await client.rpc("transition_commerce_order_status", {
        p_order_id: row.order_id,
        p_new_status: "shipped",
      });
      if (transitionError) throw transitionError;
    }

    return NextResponse.json({ shipment: data });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Could not save shipment." }, { status: 400 });
  }
}
