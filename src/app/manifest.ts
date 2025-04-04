import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Coloring Page Generator',
    short_name: 'Coloring AI',
    description: 'Create beautiful coloring pages with AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/maskable-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    orientation: 'portrait',
    categories: ['art', 'education', 'kids', 'entertainment', 'utilities'],
    screenshots: [
      {
        src: '/screenshots/create-page.png',
        sizes: '1280x720',
        type: 'image/png'
      },
      {
        src: '/screenshots/gallery-page.png',
        sizes: '1280x720',
        type: 'image/png'
      }
    ],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: 'Create Coloring Page',
        short_name: 'Create',
        description: 'Start creating a new coloring page',
        url: '/create',
        icons: [{ src: '/icons/create-icon-96x96.png', sizes: '96x96' }]
      },
      {
        name: 'Gallery',
        short_name: 'Gallery',
        description: 'Browse coloring pages gallery',
        url: '/gallery',
        icons: [{ src: '/icons/gallery-icon-96x96.png', sizes: '96x96' }]
      }
    ],
    lang: 'en',
    dir: 'ltr',
    scope: '/'
  };
} 