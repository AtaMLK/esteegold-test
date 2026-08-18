import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";

const client = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

function retrieveCheckoutForm(request) {
  return new Promise((resolve, reject) => {
    client.checkoutForm.retrieve(request, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

export async function POST(request, { params }) {
  const { conversationId } = await params;
  try {
    const form = await request.formData();
    const token = String(form.get("token") || "");
    if (!token) return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=missing-token", request.url));

    const result = await retrieveCheckoutForm({ locale: Iyzipay.LOCALE.EN, conversationId, token });
    const status = result.status === "success" && result.paymentStatus === "SUCCESS" ? "success" : "failure";
    return NextResponse.redirect(new URL(`/checkout/result?status=${status}&conversationId=${encodeURIComponent(conversationId)}`, request.url));
  } catch (error) {
    console.error("Iyzico callback verification error", error);
    return NextResponse.redirect(new URL("/checkout/result?status=failure&reason=verification", request.url));
  }
}
