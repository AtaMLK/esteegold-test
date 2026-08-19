import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../_lib/supabaseAdmin";

const client = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

function retrieveCheckoutForm(request) {
  return new Promise((resolve, reject) => {
    client.checkoutForm.retrieve(request, (error, result) => error ? reject(error) : resolve(result));
  });
}

function money(value) {
  return Number(value).toFixed(2);
}

export async function POST(request, { params }) {
  const { conversationId } = await params;

  try {
    const form = await request.formData();
    const token = String(form.get("token") || "");
    if (!token) return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=missing-token", request.url));

    const { data: payment, error: paymentLookupError } = await supabaseAdmin
      .from("commerce_payments")
      .select("id, order_id, amount, currency, token, payment_id, payment_transaction_id, payment_status")
      .eq("conversation_id", conversationId)
      .maybeSingle();

    if (paymentLookupError || !payment) return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=payment-record-not-found", request.url));
    if (payment.token && payment.token !== token) return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=invalid-token", request.url));

    const { data: order, error: orderError } = await supabaseAdmin
      .from("commerce_orders")
      .select("id, order_number, total, currency, status, payment_status")
      .eq("id", payment.order_id)
      .single();

    if (orderError || !order) return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=order-not-found", request.url));

    if (payment.payment_status === "success" && order.payment_status === "success") {
      return NextResponse.redirect(new URL(`/checkout/result?status=success&order=${encodeURIComponent(order.order_number)}&conversationId=${encodeURIComponent(conversationId)}`, request.url));
    }

    if (money(payment.amount) !== money(order.total) || String(payment.currency).toUpperCase() !== String(order.currency).toUpperCase()) {
      await supabaseAdmin.from("commerce_payments").update({ provider_status: "amount_or_currency_mismatch", payment_status: "failed", verified_at: new Date().toISOString() }).eq("id", payment.id);
      await supabaseAdmin.from("commerce_orders").update({ status: "payment_failed", payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", payment.order_id);
      return NextResponse.redirect(new URL(`/checkout/result?status=failure&reason=amount-mismatch&conversationId=${encodeURIComponent(conversationId)}`, request.url));
    }

    const result = await retrieveCheckoutForm({ locale: Iyzipay.LOCALE.EN, conversationId, token });
    const verified = result.status === "success" && result.paymentStatus === "SUCCESS";
    const transaction = result.itemTransactions?.find((item) => item.paymentTransactionId) || result.itemTransactions?.[0];
    const paymentTransactionId = transaction?.paymentTransactionId || payment.payment_transaction_id || null;

    const { error: paymentUpdateError } = await supabaseAdmin.from("commerce_payments").update({
      payment_id: result.paymentId || payment.payment_id || null,
      payment_transaction_id: paymentTransactionId,
      provider_status: result.status || null,
      payment_status: verified ? "success" : "failed",
      raw_response: result,
      verified_at: new Date().toISOString(),
    }).eq("id", payment.id);

    if (paymentUpdateError) throw paymentUpdateError;

    if (!verified) {
      await supabaseAdmin.from("commerce_orders").update({ status: "payment_failed", payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", payment.order_id);
      return NextResponse.redirect(new URL(`/checkout/result?status=failure&conversationId=${encodeURIComponent(conversationId)}`, request.url));
    }

    if (!paymentTransactionId) {
      console.error("Iyzico payment succeeded but no paymentTransactionId was returned", result);
      return NextResponse.redirect(new URL(`/checkout/result?status=review&conversationId=${encodeURIComponent(conversationId)}`, request.url));
    }

    const { data: finalized, error: finalizeError } = await supabaseAdmin.rpc("finalize_commerce_order", { p_order_id: payment.order_id });
    if (finalizeError) {
      console.error("Order finalization failed after verified payment", finalizeError);
      await supabaseAdmin.from("commerce_payments").update({ payment_status: "success", provider_status: "success_finalization_error" }).eq("id", payment.id);
      return NextResponse.redirect(new URL(`/checkout/result?status=review&conversationId=${encodeURIComponent(conversationId)}`, request.url));
    }

    return NextResponse.redirect(new URL(`/checkout/result?status=success&order=${encodeURIComponent(finalized.orderNumber)}&conversationId=${encodeURIComponent(conversationId)}`, request.url));
  } catch (error) {
    console.error("Iyzico callback verification error", error);
    return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=verification", request.url));
  }
}
