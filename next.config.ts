import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://community.fastly.steamstatic.com/economy/image/**")],
  }
};

export default nextConfig;
