/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables React strict mode
  reactStrictMode: true,
  
  // Configure image domains
  images: {
    domains: [
      'ykvizklixbwpwsvlxgzv.supabase.co',
      'avatar.vercel.sh',
      'placehold.co',
      'via.placeholder.com',
      'encrypted-tbn0.gstatic.com',
      'cdnaijncmgbikflihjld.supabase.co',
      'lh3.googleusercontent.com',
      'uploadthing.com',
      'utfs.io'
    ],
  },
  
  // Environment variable configuration
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Specify paths that use static generation during production build
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['node_modules/**/*.wasm'],
    },
  },
  
  // Skip building certain paths during deployment
  // because they depend on Supabase during build time
  output: 'standalone',
  
  // Exclude dynamic routes from being statically generated at build time
  generateBuildId: async () => {
    return `build-${new Date().toISOString()}`;
  },

  // Configure which routes are excluded from static generation
  unstable_excludeFiles: [
    '**/node_modules/next/dist/compiled/react-server-dom-webpack/client.browser.js',
    '**/app/api/**',
    '**/app/gallery/**',
    '**/app/blog/**',
    '**/app/[lang]/gallery/**',
    '**/app/[lang]/blog/**',
    '**/app/[lang]/sitemap.xml/**',
  ],
};

module.exports = nextConfig; 