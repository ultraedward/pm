/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // 🚫 NOT "export"
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;