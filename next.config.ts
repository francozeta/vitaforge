import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "twkldqdlsxiobvhsfwzh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      }
    ]
  }
};

export default nextConfig;
