import { readPublicProducts } from "./_lib/commerce/page-catalog";
import { absoluteUrl, productPath } from "./_lib/seo";
import { localizedHref } from "./_lib/localization";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const products = await readPublicProducts();
  const pages = ["/", "/bags", "/silver", "/categories", "/about", "/contact", "/size-guide"].map((path) => ({ url: absoluteUrl(path) }));
  const entries = [...pages, ...products.map((product) => ({ url: absoluteUrl(productPath(product)), ...(product.updated_at && Number.isFinite(Date.parse(product.updated_at)) ? { lastModified: product.updated_at } : {}) }))];
  return entries.flatMap((entry) => {
    const path = new URL(entry.url).pathname;
    const english = absoluteUrl(path);
    const turkish = absoluteUrl(localizedHref(path, "tr"));
    const alternates = { languages: { en: english, tr: turkish, "x-default": english } };
    return [{ ...entry, alternates }, { ...entry, url: turkish, alternates }];
  });
}
