import { NextResponse } from "next/server";
import { createServiceClient as db, requireAdmin as isAdmin, getRequestUser, isAdminUser } from "../../../_lib/server-supabase";



export async function GET(request) {
  try {
    if (!(await isAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const c = db();
    const [inventoryResult, ledgerResult, productsResult] = await Promise.all([
      c.from("commerce_inventory")
        .select("product_id,available_quantity,reserved_quantity,updated_at")
        .order("updated_at", { ascending: false }),
      c.from("commerce_inventory_ledger")
        .select("id,product_id,order_id,quantity_delta,available_delta,reserved_delta,reason,actor,metadata,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      c.from("commerce_products")
        .select("id,name"),
    ]);

    if (inventoryResult.error) throw inventoryResult.error;
    if (ledgerResult.error) throw ledgerResult.error;
    if (productsResult.error) throw productsResult.error;

    const productNames = new Map(
      (productsResult.data || []).map((product) => [String(product.id), product.name])
    );

    const inventory = (inventoryResult.data || []).map((row) => ({
      ...row,
      product_name: productNames.get(String(row.product_id)) || "Unknown product",
    }));

    const ledger = (ledgerResult.data || []).map((row) => ({
      ...row,
      product_name: productNames.get(String(row.product_id)) || "Unknown product",
    }));

    return NextResponse.json({ inventory, ledger });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Could not load inventory." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getRequestUser(request);
    if (!isAdminUser(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!body.product_id || !Number.isInteger(Number(body.delta)) || Number(body.delta) === 0 || !body.reason?.trim()) {
      return NextResponse.json({ error: "Product, non-zero integer adjustment and reason are required." }, { status: 400 });
    }

    const { data, error } = await db().rpc("adjust_commerce_inventory", {
      p_product_id: String(body.product_id),
      p_delta: Number(body.delta),
      p_reason: String(body.reason).trim(),
      p_actor: user.email,
      p_metadata: body.metadata || {},
    });

    if (error) throw error;
    return NextResponse.json({ result: data });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Could not adjust inventory." }, { status: 400 });
  }
}
