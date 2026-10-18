import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { getProducts } from "./catalog";
import { getTaxonomy } from "./taxonomy";
import { getRegionalPrice, regionForRequest } from "./regional-pricing";

export const readPublicProducts = cache(async (branch = null) => getProducts({ branch }));
export const readProduct = cache(async (id) => (await getProducts({ ids: [String(id)] }))[0] || null);
export const readPublicTaxonomy = cache(async () => getTaxonomy());

export async function regionalize(products) {
  const region = regionForRequest({ headers: await headers() });
  return products.map((product) => ({ ...product, regional_price: getRegionalPrice(product, { eur_usd_rate: product.pricing_rate_eur_usd }, region) }));
}
