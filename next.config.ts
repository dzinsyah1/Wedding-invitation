import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["phaser"],
  allowedDevOrigins: ["192.168.33.73", "127.0.0.1", "localhost"],
  compress: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/images/pixar/cut/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/cut/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
