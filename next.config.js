/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  webpack: (config) => {
    // Disable filesystem cache to reduce disk usage in constrained environments
    config.cache = false;
    return config;
  }
};

module.exports = nextConfig;
