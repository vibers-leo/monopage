import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  turbopack: {
    root: __dirname,
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
