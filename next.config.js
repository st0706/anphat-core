/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "anphat-core.vercel.app", "pacs.store", "dev.pacs.store", "unsplash.com", "utfs.io"]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
