import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["phaser"],
  allowedDevOrigins: ["192.168.33.73", "127.0.0.1", "localhost"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
