import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/emotion',
        destination: 'http://127.0.0.1:8000/emotion',
      },
      {
        source: '/chat',
        destination: 'http://127.0.0.1:8000/chat',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://127.0.0.1:8000/socket.io/:path*',
      },
    ];
  },
};

export default nextConfig;
