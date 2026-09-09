import { createClient } from "@supabase/supabase-js";

export function countryFromRequest(request) {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    ""
  ).toUpperCase();
}

export function regionForRequest(request) {
  return countryFromRequest(request) === "TR" ? "TR" : "INTL";
}

export function getRegionalPrice(product, settings, region = "INTL") {
  const eur = Number(product.price_eur ?? product.price ?? 0);
  const tryPrice = Number(product.price_try ?? 0);
  const rate = Number(settings?.eur_usd_rate || 1);
  const overrideEnabled = Boolean(product.price_usd_override_enabled);
  const usd = overrideEnabled && product.price_usd_override != null
    ? Number(product.price_usd_override)
    : eur * rate;
  const base = region === "TR" && tryPrice > 0
    ? { amount: tryPrice, currency: "TRY" }
    : { amount: eur, currency: "EUR" };

  return {
    eur: Number(eur.toFixed(2)),
    usd: Number(usd.toFixed(2)),
    try: Number(tryPrice.toFixed(2)),
    amount: Number(base.amount.toFixed(2)),
    currency: base.currency,
    region,
    eurUsdRate: rate,
  };
}

export async function getPricingSettings(client) {
  const { data, error } = await client
    .from("commerce_pricing_settings")
    .select("eur_usd_rate")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  return data || { eur_usd_rate: 1.08 };
}

export async function getPricingContext() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return getPricingSettings(createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }));
}
