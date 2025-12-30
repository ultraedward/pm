/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Force non-export runtime output
  output: "standalone",
};

module.exports = nextConfig;
