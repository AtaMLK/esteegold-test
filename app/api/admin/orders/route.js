import { NextResponse } from "next/server";
import { createServiceClient as adminClient, requireAdmin } from "../../../_lib/server-supabase";

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const client = adminClient();
    const { data: orders, error } = await client.from("commerce_orders").select("id,order_number,status,payment_status,currency,subtotal,discount_total,shipping_total,total,customer_snapshot,address_snapshot,created_at,paid_at,updated_at").order("created_at", { ascending: false });
    if (error) throw error;
    const ids = (orders || []).map((o) => o.id); let items = [];
    if (ids.length) { const result = await client.from("commerce_order_items").select("id,order_id,product_id,product_line,product_name_snapshot,category_snapshot,options_snapshot,quantity,unit_list_price,unit_discount,unit_final_price,line_total").in("order_id", ids); if (result.error) throw result.error; items = result.data || []; }
    return NextResponse.json({ orders: (orders || []).map((order) => ({ ...order, items: items.filter((item) => item.order_id === order.id) })) });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not load orders." }, { status: 500 }); }
}
export async function PATCH(request) {
  try {
    if (!(await requireAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id, status } = await request.json();
    const allowed = ["pending_payment", "paid", "processing", "shipped", "delivered", "canceled", "payment_failed"];
    if (!id || !allowed.includes(status)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    const { data, error } = await adminClient().rpc("transition_commerce_order_status", { p_order_id: id, p_new_status: status });
    if (error) throw error;
    if (!data?.success) throw new Error("Order status change was not completed.");
    return NextResponse.json({ order: data });
  } catch (error) { return NextResponse.json({ error: error.message || "Could not update order." }, { status: 400 }); }
}
