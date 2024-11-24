import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    IMAGE_API_URL: process.env.NEXT_PUBLIC_IMAGE_API_URL || 'http://localhost:4000/i',
  },
};

export default nextConfig;
