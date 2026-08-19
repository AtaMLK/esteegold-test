import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});
 */
function getIyzipay() {
  const apiKey = process.env.IYZIPAY_API_KEY;
  const secretKey = process.env.IYZIPAY_SECRET_KEY;
  const uri = process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    throw new Error("Iyzico API credentials are not configured.");
  }

  return new Iyzipay({
    apiKey,
    secretKey,
    uri,
  });
}


function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

/* function refundProvider(request) {
  return new Promise((resolve, reject) => {
    iyzipay.refund.create(request, (error, result) => error ? reject(error) : resolve(result));
  });
} */

  function refundProvider(request) {
  const iyzipay = getIyzipay();

  return new Promise((resolve, reject) => {
    iyzipay.refund.create(request, (error, result) =>
      error ? reject(error) : resolve(result)
    );
  });
}

export async function POST(request) {
  try {
    if (!(await admin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, reason } = await request.json();
    if (!orderId) return NextResponse.json({ error: "Order id is required." }, { status: 400 });

    const c = db();
    const { data: order, error: orderError } = await c
      .from("commerce_orders")
      .select("id, order_number, status, payment_status, total, currency")
      .eq("id", orderId)
      .single();
    if (orderError) throw orderError;

    if (order.payment_status !== "success") return NextResponse.json({ error: "Only successfully paid orders can be refunded." }, { status: 409 });
    if (["shipped", "delivered"].includes(order.status)) return NextResponse.json({ error: "Fulfilled orders require a separate return/refund workflow." }, { status: 409 });
    if (order.status === "canceled" || order.payment_status === "refunded") return NextResponse.json({ error: "This order has already been canceled or refunded." }, { status: 409 });

    const { data: payment, error: paymentError } = await c
      .from("commerce_payments")
      .select("id, payment_id, payment_transaction_id, amount, currency, payment_status")
      .eq("order_id", orderId)
      .eq("payment_status", "success")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment) return NextResponse.json({ error: "Successful payment record not found." }, { status: 409 });
    if (!payment.payment_transaction_id) return NextResponse.json({ error: "Iyzico payment transaction id is missing; refund cannot be performed safely." }, { status: 409 });

    const { data: existingRefund } = await c
      .from("commerce_refunds")
      .select("id, status, amount")
      .eq("payment_id", payment.id)
      .in("status", ["pending", "success"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingRefund?.status === "success") return NextResponse.json({ success: true, alreadyRefunded: true, refundId: existingRefund.id });
    if (existingRefund?.status === "pending") return NextResponse.json({ error: "A refund is already being processed." }, { status: 409 });

    // This endpoint intentionally performs full refunds only. Partial refunds need item-level
    // allocation so inventory is not released for products that remain fulfilled.
    if (Number(payment.amount).toFixed(2) !== Number(order.total).toFixed(2)) {
      return NextResponse.json({ error: "Payment amount does not match order total." }, { status: 409 });
    }

    const { data: refund, error: refundInsertError } = await c
      .from("commerce_refunds")
      .insert({
        order_id: order.id,
        payment_id: payment.id,
        payment_transaction_id: payment.payment_transaction_id,
        amount: payment.amount,
        currency: payment.currency,
        status: "pending",
        reason: reason?.trim() || null,
      })
      .select()
      .single();
    if (refundInsertError) throw refundInsertError;

    const providerResult = await refundProvider({
      locale: Iyzipay.LOCALE.EN,
      conversationId: `refund-${order.order_number}-${refund.id}`,
      paymentTransactionId: payment.payment_transaction_id,
      price: Number(payment.amount).toFixed(2),
      currency: payment.currency,
    });

    const providerSuccess = providerResult?.status === "success";

    await c.from("commerce_refunds").update({
      status: providerSuccess ? "success" : "failed",
      provider_refund_id: providerResult?.paymentId || providerResult?.refundId || null,
      provider_status: providerResult?.status || null,
      raw_response: providerResult,
      completed_at: providerSuccess ? new Date().toISOString() : null,
    }).eq("id", refund.id);

    if (!providerSuccess) {
      return NextResponse.json({ error: providerResult?.errorMessage || "Iyzico refund was not successful.", provider: providerResult }, { status: 502 });
    }

    const { data: finalized, error: completeError } = await c.rpc("complete_commerce_refund", { p_refund_id: refund.id });
    if (completeError) {
      console.error("Refund succeeded at Iyzico but local completion failed", completeError);
      return NextResponse.json({ error: "Refund succeeded with Iyzico, but local inventory completion requires review.", refundId: refund.id }, { status: 500 });
    }

    return NextResponse.json({ success: true, refundId: refund.id, result: finalized });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Refund request failed." }, { status: 400 });
  }
}
