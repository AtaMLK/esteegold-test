/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pludtlsowczexcydyrzt.supabase.co",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.103"],
};

export default nextConfig;
