export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://esteegold-test.vercel.app";
  return ["/", "/bags", "/silver", "/categories", "/about", "/contact"].map((path) => ({ url: new URL(path, base).href }));
}
