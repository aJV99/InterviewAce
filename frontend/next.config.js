/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_BASE_URL}:path*`, // Use the BACKEND_BASE_URL from your environment variable
      },
    ];
  },
};

module.exports = nextConfig;
