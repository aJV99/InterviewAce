/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  },
};

module.exports = nextConfig;
