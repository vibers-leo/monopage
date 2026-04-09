import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // www 제거 리다이렉트
      {
        source: '/:path*',
        destination: '/:path*',
        permanent: false,
        has: [{ type: 'host', value: 'www.monopage.kr' }],
      },
    ];
  },
};

export default nextConfig;
