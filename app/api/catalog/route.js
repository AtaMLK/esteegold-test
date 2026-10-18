import { NextResponse } from "next/server";
import { getTaxonomy } from "../../_lib/commerce/taxonomy";
import { getProducts } from "../../_lib/commerce/catalog";
import { getRegionalPrice, regionForRequest } from "../../_lib/commerce/regional-pricing";

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const branchParam = params.get("branch");
    const idParam = params.get("ids");
    const search = params.get("search") || "";
    if (branchParam && branchParam.length > 60) return NextResponse.json({ error: "Invalid branch." }, { status: 400 });
    const ids = idParam ? idParam.split(",").map((id) => id.trim()).filter(Boolean) : null;
    const [products, taxonomy] = await Promise.all([getProducts({ branch: branchParam || null, ids, search }), !ids && !branchParam ? getTaxonomy() : Promise.resolve({ branches: [], categories: [] })]);
    const region = regionForRequest(request);
    const regionalProducts = products.map((product) => ({ ...product, regional_price: getRegionalPrice(product, { eur_usd_rate: product.pricing_rate_eur_usd }, region) }));
    return NextResponse.json({ products: regionalProducts, region, ...taxonomy }, { headers: { "Cache-Control": "private, no-store", Vary: "X-Vercel-IP-Country" } });
  } catch (error) {
    console.error("Catalog error", error);
    return NextResponse.json({ error: "Unable to load catalog." }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}
