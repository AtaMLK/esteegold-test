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
  };

  export default nextConfig;
