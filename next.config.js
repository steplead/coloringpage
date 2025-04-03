/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sc-maas.oss-cn-shanghai.aliyuncs.com',
        port: '',
        pathname: '/outputs/**',
      },
    ],
  },
  // The i18n config is removed as it's not compatible with App Router
  // App Router uses middleware and the Link component for i18n instead
};

module.exports = nextConfig; 