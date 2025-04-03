import { Metadata } from 'next';
import { getImageById } from '@/lib/supabase';

export const revalidate = 3600; // Revalidate this page every hour

// Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const image = await getImageById(params.id);
  
  if (!image) {
    return {
      title: 'Coloring Page Not Found',
      description: 'The requested coloring page was not found. Explore our gallery to find beautiful coloring pages.',
    };
  }
  
  return {
    title: image.title || `${image.prompt.substring(0, 50)} Coloring Page`,
    description: image.seo_description || `Free printable coloring page featuring ${image.prompt.substring(0, 100)}. Perfect for children and adults who enjoy coloring activities.`,
    openGraph: {
      title: image.title || `${image.prompt.substring(0, 50)} Coloring Page`,
      description: image.seo_description || `Free printable coloring page featuring ${image.prompt.substring(0, 100)}`,
      images: [image.image_url],
      type: 'article',
    },
    keywords: image.keywords || ['coloring page', 'printable', 'free coloring', image.style || 'standard'],
    alternates: {
      canonical: `https://ai-coloringpage.com/gallery/${params.id}`,
    },
  };
} 