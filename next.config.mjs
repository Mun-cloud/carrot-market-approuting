/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
      { hostname: process.env.CLOUDFLARE_DOMAIN },
    ],
  },
};

export default nextConfig;
