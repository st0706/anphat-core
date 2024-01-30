/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "anphat-core.vercel-mu.app", "unsplash.com", "utfs.io"]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
