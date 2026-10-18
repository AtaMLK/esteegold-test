import { localizedHref, localizedProduct, categoryLabel } from "../_lib/localization";
import CatalogBrowser from "./catalog-browser";
import { readPublicProducts, readPublicTaxonomy, regionalize } from "../_lib/commerce/page-catalog";
import { normalizeCollection } from "../_components/ui/collection-label";
import { pageMetadata, absoluteUrl, productPath, breadcrumbSchema } from "../_lib/seo";
import StructuredData from "../_components/ui/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const filters = await searchParams;
  return pageMetadata({ title: "Handmade Bags & Silver Collection | EsteeHouse", description: "Explore the current EsteeHouse collection of handmade bags and silver. Compare pieces, materials and sizes, with dedicated pages for every active product.", path: "/categories", noindex: Object.keys(filters).length > 0 });
}

export default async function CategoriesPage({ searchParams, locale = "en" }) {
  const filters = await searchParams;
  const [products, taxonomy] = await Promise.all([readPublicProducts(), readPublicTaxonomy()]);
  const initialFilters = { branch: normalizeCollection(typeof filters.branch === "string" ? filters.branch : null), category: typeof filters.category === "string" ? filters.category : "all", search: typeof filters.search === "string" ? filters.search : "" };
  const canonicalBranch = initialFilters.branch === "silver" ? "EsteeGold" : initialFilters.branch === "bags" ? "EsteeBags" : initialFilters.branch;
  const matching = products.filter((product) => (canonicalBranch === "all" || product.branch === canonicalBranch) && (initialFilters.category === "all" || String(product.category || "").trim().toLowerCase() === initialFilters.category.trim().toLowerCase()) && (!initialFilters.search || [product.name, product.category, categoryLabel(product.category, locale), product.branch, product.description, localizedProduct(product, locale).description].filter(Boolean).some((value) => String(value).toLowerCase().includes(initialFilters.search.toLowerCase()))));
  const list = { "@type": "ItemList", itemListElement: matching.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(localizedHref(productPath(product), locale)), name: product.name })) };
  return <><StructuredData data={[list, breadcrumbSchema([{ name: "EsteeHouse", path: localizedHref("/", locale) }, { name: locale === "tr" ? "Koleksiyon" : "The collection", path: localizedHref("/categories", locale) }])]} /><CatalogBrowser initialData={{ ...taxonomy, products: await regionalize(products) }} initialFilters={initialFilters}/></>;
}
