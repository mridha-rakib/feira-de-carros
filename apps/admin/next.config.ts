import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Support standalone output for containerized/CI deployments while avoiding Windows EPERM symlink restrictions locally
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@feira/ui', '@feira/api-client', '@feira/logger'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
