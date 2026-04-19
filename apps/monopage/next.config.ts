import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'storage.vibers.co.kr' },
    ],
  },
  async redirects() {
    return [
      // www 제거 리다이렉트
      {
        source: '/:path*',
        destination: 'https://monopage.kr/:path*',
        permanent: true,
        has: [{ type: 'host', value: 'www.monopage.kr' }],
      },
    ];
  },
};

export default nextConfig;
