import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Set workspace root to silence lockfile warning
  outputFileTracingRoot: __dirname,

  // Optimize images
  images: {
    domains: ['logo.clearbit.com', 'www.google.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Enable compression
  compress: true,
  
  // Optimize production builds
  productionBrowserSourceMaps: false,
  
  // Enable React optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
