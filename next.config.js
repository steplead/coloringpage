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
};

module.exports = nextConfig; 