/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    typedRoutes: false, // 🔥 MUST BE FALSE
  },
};

module.exports = nextConfig;