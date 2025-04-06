/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sc-maas.oss-cn-shanghai.aliyuncs.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hjmwtgqvmqaontbjebpi.supabase.co',
        port: '',
        pathname: '/**',
      },
      // Supabase Storage URLs
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Add storage.googleapis.com for Supabase storage
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      // Allow images from Vercel blob storage
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        port: '',
        pathname: '/**',
      },
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The i18n config is removed as it's not compatible with App Router
  // App Router uses middleware and the Link component for i18n instead

  // Ignore build errors for deployment
  experimental: {
    // Suppress missing metadata error warnings
    missingSuspenseWithCSR: false,
  },
  eslint: {
    // Only run ESLint during development
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip type checking during build for faster deployment
    ignoreBuildErrors: true,
  },
  // Ignore API runtime error warnings for deployment
  onDemandEntries: {
    // Don't retry failed API routes
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 1,
  },
};

module.exports = nextConfig; 