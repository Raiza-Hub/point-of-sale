import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oceanic-okapi-791.convex.cloud"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
    ]
  }
};

export default nextConfig;
