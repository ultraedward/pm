/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: false, // ⬅️ TURN THIS OFF
  },
};

module.exports = nextConfig;