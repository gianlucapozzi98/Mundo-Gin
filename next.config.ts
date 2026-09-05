import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/mundo-club",
        destination: "/club",
        permanent: true,
      },
      {
        source: "/mundo-club/:path*",
        destination: "/club/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
