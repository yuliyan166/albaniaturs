/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote images from GitHub raw content or standard image services
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;