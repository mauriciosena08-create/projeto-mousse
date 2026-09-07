import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-php/:path*",
        destination: "https://projeto-mousse.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
