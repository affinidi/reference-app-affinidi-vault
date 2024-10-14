/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add polyfill for 'events' module for browser environments
      config.resolve.fallback = {
        ...config.resolve.fallback, // preserve existing fallbacks
        events: 'events',
      };
    }
    return config;
  },
};

export default nextConfig;
