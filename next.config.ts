import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: [
    "f3a7-103-146-197-13.ngrok-free.app", 
    "*.ngrok-free.app"
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};



export default nextConfig;
