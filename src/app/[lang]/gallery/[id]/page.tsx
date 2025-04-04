import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import GalleryDetailPage from '@/app/gallery/[id]/page';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { getTranslations } from '@/lib/i18n/translations';

// Generate metadata for this page
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string; lang: string; }
}): Promise<Metadata> {
  const { id, lang } = params;
  
  // Fetch image details
  const { data: image } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!image) {
    return {
      title: 'Image Not Found',
      description: 'The requested coloring page could not be found.'
    };
  }
  
  // Get translations for the current language
  const t = await getTranslations(lang);

  const title = `${image.title || image.prompt || 'Coloring Page'} | ${t.common.appName}`;
  const description = image.description || image.prompt || `A beautiful coloring page created with AI.`;
  const imageUrl = image.image_url;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: image.title || image.prompt || 'Coloring page'
        }
      ],
      locale: lang,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://ai-coloringpage.com/${lang}/gallery/${id}`,
      languages: {
        'x-default': `https://ai-coloringpage.com/gallery/${id}`
      }
    }
  };
}

// JSON-LD structured data generator
async function generateJsonLd(id: string, lang: string) {
  const { data: image } = await supabase
    .from('images')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!image) return null;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: image.title || image.prompt || 'AI Generated Coloring Page',
    description: image.description || image.prompt || 'A coloring page created with AI technology',
    contentUrl: image.image_url,
    thumbnailUrl: image.thumbnail_url || image.image_url,
    uploadDate: image.created_at,
    encodingFormat: 'image/png',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'AI Coloring Page Generator',
      url: baseUrl
    },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    acquireLicensePage: `${baseUrl}/${lang}/about`,
    copyrightNotice: `© ${new Date().getFullYear()} AI Coloring Page Generator`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };
}

export default async function LanguageGalleryDetailPage({ 
  params 
}: { 
  params: { id: string; lang: string; }
}) {
  const { id, lang } = params;
  
  // Generate JSON-LD
  const jsonLd = await generateJsonLd(id, lang);
  
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
      <GalleryDetailPage params={{ id, lang }} />
    </>
  );
}

export async function generateStaticParams() {
  // Get the most recent 10 public images
  const { data: images } = await supabase
    .from('images')
    .select('id')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(10);

  const paths = [];
  
  // Generate paths for each image in each language
  for (const image of images || []) {
    for (const lang of SUPPORTED_LANGUAGES) {
      paths.push({
        id: image.id.toString(),
        lang: lang.code
      });
    }
  }
  
  return paths;
} 