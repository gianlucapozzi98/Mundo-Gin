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
      {
        source: "/club/mundo-castel",
        destination: "/club/mundo-castle",
        permanent: true,
      },
      {
        source: "/club/mundo-castel/:path*",
        destination: "/club/mundo-castle/:path*",
        permanent: true,
      },
      {
        source: "/mundo-castel",
        destination: "/club/mundo-castle",
        permanent: true,
      },
      {
        source: "/mundo-castel/:path*",
        destination: "/club/mundo-castle/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
