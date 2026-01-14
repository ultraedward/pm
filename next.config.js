/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack(config) {
    config.resolve.alias["@/app/dashboard_disabled"] = false;
    return config;
  },
};

module.exports = nextConfig;
