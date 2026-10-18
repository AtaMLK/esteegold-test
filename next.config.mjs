/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const privatePaths = ["/admin/:path*", "/auth/:path*", "/api/:path*", "/profile", "/dashboard", "/cart", "/wishlist", "/whishlist", "/checkout/:path*", "/tr/auth/:path*", "/tr/profile", "/tr/cart", "/tr/wishlist", "/tr/checkout/:path*"];
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    const rules = privatePaths.map((source) => ({ source, headers: noindex }));
    if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview" || process.env.SEO_INDEXING_ENABLED !== "true" || !process.env.NEXT_PUBLIC_SITE_URL) rules.push({ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] });
    return rules;
  },
  images: {
    formats: ["image/webp"],
    qualities: [75, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pludtlsowczexcydyrzt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
