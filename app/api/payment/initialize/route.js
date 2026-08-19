import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";
import { getProductMap, priceForProduct } from "../../../_lib/commerce/catalog";
import { supabaseAdmin } from "../../../_lib/supabaseAdmin";

const client = new Iyzipay({ apiKey: process.env.IYZIPAY_API_KEY, secretKey: process.env.IYZIPAY_SECRET_KEY, uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com" });

function createCheckoutForm(request) { return new Promise((resolve, reject) => client.checkoutFormInitialize.create(request, (error, result) => error ? reject(error) : resolve(result))); }
function cleanName(value, fallback = "Customer") { const text = String(value || "").trim(); return text || fallback; }
function orderNumber() { return `EH-${new Date().toISOString().slice(0,10).replaceAll("-", "")}-${crypto.randomUUID().replaceAll("-", "").slice(0,8).toUpperCase()}`; }

export async function POST(request) {
  let createdOrderId = null;
  try {
    if (!process.env.IYZIPAY_API_KEY || !process.env.IYZIPAY_SECRET_KEY) return NextResponse.json({ error: "Iyzico API credentials are not configured." }, { status: 503 });
    const body = await request.json();
    const { items, customer, address, acceptedTerms, acceptedShipping } = body;
    if (!acceptedTerms || !acceptedShipping) return NextResponse.json({ error: "Terms and shipping acceptance are required." }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    if (!customer?.email || !customer?.fullName) return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    if (!address?.address || !address?.city || !address?.postalCode) return NextResponse.json({ error: "A complete shipping address is required." }, { status: 400 });

    const ids = [...new Set(items.map((item) => String(item.id)))];
    const productMap = await getProductMap(ids);
    const safeItems = items.map((item) => {
      const product = productMap.get(String(item.id));
      const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity || 1))));
      const pricing = priceForProduct(product);
      return { id: product.id, product, quantity, pricing, options: item.options && typeof item.options === "object" ? item.options : {} };
    });

    const subtotal = Number(safeItems.reduce((sum, item) => sum + item.pricing.listPrice * item.quantity, 0).toFixed(2));
    const discountTotal = Number(safeItems.reduce((sum, item) => sum + item.pricing.unitDiscount * item.quantity, 0).toFixed(2));
    const total = Number((subtotal - discountTotal).toFixed(2));
    const conversationId = `EH-${crypto.randomUUID()}`;
    const customerSnapshot = { fullName: cleanName(customer.fullName), email: cleanName(customer.email).toLowerCase(), phone: cleanName(customer.phone, "") };
    const addressSnapshot = { address: cleanName(address.address), city: cleanName(address.city), postalCode: cleanName(address.postalCode), country: cleanName(address.country, "Turkey") };

    const { data: order, error: orderError } = await supabaseAdmin.from("commerce_orders").insert({ order_number: orderNumber(), status: "pending_payment", payment_status: "pending", currency: "EUR", subtotal, discount_total: discountTotal, shipping_total: 0, total, customer_snapshot: customerSnapshot, address_snapshot: addressSnapshot, terms_accepted: true, shipping_terms_accepted: true, terms_accepted_at: new Date().toISOString(), shipping_terms_accepted_at: new Date().toISOString() }).select("id,order_number,total").single();
    if (orderError) throw new Error(`ORDER_CREATE_FAILED:${orderError.message}`);
    createdOrderId = order.id;

    const { error: itemError } = await supabaseAdmin.from("commerce_order_items").insert(safeItems.map(({ id, product, quantity, pricing, options }) => ({ order_id: order.id, product_id: id, product_line: product.branch, product_name_snapshot: product.name, category_snapshot: product.category, options_snapshot: options, quantity, unit_list_price: pricing.listPrice, unit_discount: pricing.unitDiscount, unit_final_price: pricing.finalPrice, line_total: pricing.finalPrice * quantity })));
    if (itemError) throw new Error(`ORDER_ITEMS_CREATE_FAILED:${itemError.message}`);

    const [name, ...surnameParts] = cleanName(customer.fullName).split(/\s+/);
    const surname = surnameParts.join(" ") || name;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const result = await createCheckoutForm({
      locale: Iyzipay.LOCALE.EN, conversationId, price: total.toFixed(2), paidPrice: total.toFixed(2), currency: Iyzipay.CURRENCY.EUR,
      basketId: order.order_number, paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${siteUrl}/api/payment/callback/${encodeURIComponent(conversationId)}`, enabledInstallments: [1],
      buyer: { id: order.order_number, name, surname, gsmNumber: cleanName(customer.phone, "+900000000000"), email: customerSnapshot.email, identityNumber: String(customer.identityNumber || "00000000000"), registrationAddress: addressSnapshot.address, city: addressSnapshot.city, country: addressSnapshot.country, zipCode: addressSnapshot.postalCode, ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1" },
      shippingAddress: { contactName: customerSnapshot.fullName, city: addressSnapshot.city, country: addressSnapshot.country, address: addressSnapshot.address, zipCode: addressSnapshot.postalCode },
      billingAddress: { contactName: customerSnapshot.fullName, city: addressSnapshot.city, country: addressSnapshot.country, address: addressSnapshot.address, zipCode: addressSnapshot.postalCode },
      basketItems: safeItems.map(({ id, product, quantity, pricing }) => ({ id: `BI-${id}`, name: product.name, category1: product.category, itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, price: (pricing.finalPrice * quantity).toFixed(2) })),
    });

    if (result.status !== "success" || !result.paymentPageUrl || !result.token) {
      await supabaseAdmin.from("commerce_orders").update({ status: "payment_failed", payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", order.id);
      return NextResponse.json({ error: result.errorMessage || "Unable to initialize payment." }, { status: 502 });
    }

    const { error: paymentError } = await supabaseAdmin.from("commerce_payments").insert({ order_id: order.id, provider: "iyzico", conversation_id: conversationId, token: result.token, provider_status: result.status, payment_status: "pending", amount: total, currency: "EUR" });
    if (paymentError) throw new Error(`PAYMENT_RECORD_FAILED:${paymentError.message}`);

    return NextResponse.json({ paymentPageUrl: result.paymentPageUrl, token: result.token, conversationId, orderNumber: order.order_number });
  } catch (error) {
    console.error("Payment initialization error", error);
    if (createdOrderId) await supabaseAdmin.from("commerce_orders").update({ status: "payment_failed", payment_status: "failed", updated_at: new Date().toISOString() }).eq("id", createdOrderId);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to initialize payment." }, { status: 500 });
  }
}
