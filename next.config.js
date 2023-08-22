/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["resizing.flixster.com", "images.fandango.com"],
  },
  experimental: {
    serverActions: true,
  },
};
module.exports = nextConfig;
