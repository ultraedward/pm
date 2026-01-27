/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  webpack(config) {
    config.watchOptions = {
      ignored: ["**/disabled/**"]
    };
    return config;
  }
};

module.exports = nextConfig;