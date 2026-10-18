import { hasTranslation, localizedHref, unlocalizedPath } from "./localization";
import { supportEmail } from "./store-contact";

export const siteDescription = "Handmade bags and silver from Türkiye. Discover EsteeBags and EsteeGold, two collections brought together by EsteeHouse.";

export function siteUrl(environment = process.env) {
  const address = new URL(environment.NEXT_PUBLIC_SITE_URL || "https://theesteehouse.com");
  if (!["https:", "http:"].includes(address.protocol) || address.username || address.password) throw new Error("NEXT_PUBLIC_SITE_URL must be a public website URL.");
  return address.origin;
}

export function indexingEnabled(environment = process.env) {
  return environment.NODE_ENV === "production" && environment.VERCEL_ENV !== "preview" && environment.SEO_INDEXING_ENABLED === "true" && Boolean(environment.NEXT_PUBLIC_SITE_URL) && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(siteUrl(environment)).hostname);
}

export function absoluteUrl(path) { return new URL(path, siteUrl()).href; }
export function productPath(product) { return `/product/${encodeURIComponent(String(product.id))}`; }

export function pageMetadata({ title, description = siteDescription, path = "/", image = "/images/bags/bag3.jpg", noindex = false, locale = "en" }) {
  const canonicalPath = localizedHref(path, locale);
  const basePath = unlocalizedPath(path);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(canonicalPath), ...(hasTranslation(basePath) ? { languages: { en: absoluteUrl(basePath), tr: absoluteUrl(localizedHref(basePath, "tr")), "x-default": absoluteUrl(basePath) } } : {}) },
    robots: { index: indexingEnabled() && !noindex, follow: true, googleBot: { index: indexingEnabled() && !noindex, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { type: "website", siteName: "EsteeHouse", title, description, url: absoluteUrl(canonicalPath), locale: locale === "tr" ? "tr_TR" : "en_US", alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"], images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] },
  };
}

export function productDescription(product) {
  const description = String(product.description || "").replace(/\s+/g, " ").trim();
  return description || `${product.name} from the EsteeHouse ${product.category || "handmade"} collection. View the piece, its materials and available sizes.`;
}

export function productImage(product) {
  return product.media?.find((media) => media.kind === "image" && media.is_primary)?.url || product.media?.find((media) => media.kind === "image")?.url || product.image_url || "/images/Hero-bg-1.jpg";
}

export function productSchema(product, locale = "en") {
  const image = product.media?.find((media) => media.kind === "image" && media.is_primary)?.url || product.media?.find((media) => media.kind === "image")?.url || product.image_url;
  return {
    "@type": "Product",
    "@id": absoluteUrl(localizedHref(productPath(product), locale)) + "#product",
    name: product.name,
    description: productDescription(product),
    url: absoluteUrl(localizedHref(productPath(product), locale)),
    ...(image ? { image: [absoluteUrl(image)] } : {}),
    productID: String(product.id),
    category: product.category,
    brand: { "@type": "Brand", name: product.branch },
  };
}

export function breadcrumbSchema(items) {
  return { "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}

export function siteSchema() {
  return [
    { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: "EsteeHouse", url: siteUrl(), email: supportEmail },
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: "EsteeHouse", url: siteUrl(), inLanguage: ["en", "tr"], description: siteDescription, publisher: { "@id": absoluteUrl("/#organization") } },
  ];
}

export function serializeSchema(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
