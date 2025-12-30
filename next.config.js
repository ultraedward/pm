/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🚫 Force-disable static export
  output: "standalone",

  // Ensure App Router runs dynamically
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
