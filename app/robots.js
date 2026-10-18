import { indexingEnabled, absoluteUrl } from "./_lib/seo";

export default function robots() {
  if (!indexingEnabled()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/auth/", "/profile", "/dashboard", "/cart", "/wishlist", "/whishlist", "/checkout", "/tr/auth/", "/tr/profile", "/tr/cart", "/tr/wishlist", "/tr/checkout"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
