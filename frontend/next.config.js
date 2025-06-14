/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gipqnasjjgsmdqslyunf.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;