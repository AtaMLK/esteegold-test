import Iyzipay from "iyzipay";
import { NextResponse } from "next/server";

const CATALOG = {
  "1": { name: "Essential Ring", category: "Rings", price: 69 },
  "2": { name: "Layered Set", category: "Sets", price: 118 },
  "3": { name: "Statement Earrings", category: "Earrings", price: 48 },
  "4": { name: "Hand Combination", category: "Bracelets", price: 92 },
  "5": { name: "Classic Earrings", category: "Earrings", price: 39.99 },
  "6": { name: "Everyday Bracelet", category: "Bracelets", price: 59 },
};

const client = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com",
});

function createCheckoutForm(request) {
  return new Promise((resolve, reject) => {
    client.checkoutFormInitialize.create(request, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

function cleanName(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

export async function POST(request) {
  try {
    if (!process.env.IYZPAY_API_KEY && !process.env.IYZIPAY_API_KEY) {
      return NextResponse.json({ error: "Iyzico API credentials are not configured." }, { status: 503 });
    }

    const body = await request.json();
    const { items, customer, address, acceptedTerms, acceptedShipping } = body;

    if (!acceptedTerms || !acceptedShipping) {
      return NextResponse.json({ error: "Terms and shipping acceptance are required." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    }
    if (!customer?.email || !customer?.fullName || !customer?.identityNumber) {
      return NextResponse.json({ error: "Name, email and identity number are required." }, { status: 400 });
    }
    if (!address?.address || !address?.city || !address?.postalCode) {
      return NextResponse.json({ error: "A complete shipping address is required." }, { status: 400 });
    }

    const [name, ...surnameParts] = cleanName(customer.fullName, "Customer").split(/\s+/);
    const surname = surnameParts.join(" ") || name;
    const safeItems = items.map((item) => {
      const catalogItem = CATALOG[String(item.id)];
      if (!catalogItem) throw new Error(`Unknown product: ${item.id}`);
      const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
      return { id: String(item.id), catalogItem, quantity };
    });

    const basketItems = safeItems.map(({ id, catalogItem, quantity }) => ({
      id: `BI-${id}`,
      name: catalogItem.name,
      category1: catalogItem.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (catalogItem.price * quantity).toFixed(2),
    }));

    const total = safeItems.reduce((sum, { catalogItem, quantity }) => sum + catalogItem.price * quantity, 0);
    const conversationId = `EH-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const callbackUrl = `${siteUrl}/api/payment/callback/${encodeURIComponent(conversationId)}`;

    const checkoutRequest = {
      locale: Iyzipay.LOCALE.EN,
      conversationId,
      price: total.toFixed(2),
      paidPrice: total.toFixed(2),
      currency: Iyzipay.CURRENCY.EUR,
      basketId: conversationId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: conversationId,
        name,
        surname,
        gsmNumber: cleanName(customer.phone, "+900000000000"),
        email: customer.email,
        identityNumber: String(customer.identityNumber),
        registrationAddress: address.address,
        city: address.city,
        country: "Turkey",
        zipCode: address.postalCode,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1",
      },
      shippingAddress: {
        contactName: customer.fullName,
        city: address.city,
        country: "Turkey",
        address: address.address,
        zipCode: address.postalCode,
      },
      billingAddress: {
        contactName: customer.fullName,
        city: address.city,
        country: "Turkey",
        address: address.address,
        zipCode: address.postalCode,
      },
      basketItems,
    };

    const result = await createCheckoutForm(checkoutRequest);

    if (result.status !== "success" || !result.paymentPageUrl) {
      console.error("Iyzico initialize failed", result);
      return NextResponse.json({ error: result.errorMessage || "Unable to initialize payment." }, { status: 502 });
    }

    return NextResponse.json({ paymentPageUrl: result.paymentPageUrl, token: result.token, conversationId });
  } catch (error) {
    console.error("Payment initialization error", error);
    return NextResponse.json({ error: "Unable to initialize payment." }, { status: 500 });
  }
}
