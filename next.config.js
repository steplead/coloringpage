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
};

module.exports = nextConfig; 