/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for JSON file writes in API routes
  // On Vercel, data writes won't persist between deployments
  // but work perfectly in local development
};

module.exports = nextConfig;
