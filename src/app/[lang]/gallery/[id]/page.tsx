import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import GalleryDetailPage from '@/app/gallery/[id]/page';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { getTranslations } from '@/lib/i18n/translations';

// Determine if we're running during build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

// Generate metadata for this page
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string; lang: string; }
}): Promise<Metadata> {
  const { id, lang } = params;
  
  // Get translations for the current language
  const t = await getTranslations(lang);
  
  // Skip database query during build time
  if (isBuildTime) {
    return {
      title: `${t.gallery.detail.defaultTitle} | ${t.common.appName}`,
      description: t.gallery.detail.defaultDescription
    };
  }

  // Fetch image details
  try {
    const { data: image } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!image) {
      return {
        title: t.gallery.detail.notFoundTitle,
        description: t.gallery.detail.notFoundDescription
      };
    }
    
    const title = `${image.title || image.prompt || t.gallery.detail.defaultTitle} | ${t.common.appName}`;
    const description = image.description || image.prompt || t.gallery.detail.defaultDescription;
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
            alt: image.title || image.prompt || t.gallery.detail.defaultTitle
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
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    return {
      title: `${t.gallery.detail.defaultTitle} | ${t.common.appName}`,
      description: t.gallery.detail.defaultDescription
    };
  }
}

// JSON-LD structured data generator
async function generateJsonLd(id: string, lang: string) {
  // Skip database query during build time
  if (isBuildTime) {
    return null;
  }
  
  try {
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
  } catch (error) {
    console.error('Error generating JSON-LD:', error);
    return null;
  }
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

// Only generate a few static paths during build, and handle the rest on-demand
export async function generateStaticParams() {
  // Skip database query during build time or return minimal set
  if (isBuildTime) {
    // Return a minimal set of sample IDs for initial static generation
    return [
      { id: 'sample-id-1', lang: 'en' },
      { id: 'sample-id-1', lang: 'zh' },
    ];
  }
  
  try {
    // Get the most recent 5 public images (reduced from 10)
    const { data: images } = await supabase
      .from('images')
      .select('id')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(5);

    const paths = [];
    
    // Generate paths for each image in supported languages
    for (const image of images || []) {
      // Only generate for languages with actual translations (en, zh)
      const activeLangs = SUPPORTED_LANGUAGES.filter(
        lang => ['en', 'zh'].includes(lang.code)
      );
      
      for (const lang of activeLangs) {
        paths.push({
          id: image.id.toString(),
          lang: lang.code
        });
      }
    }
    
    return paths;
  } catch (error) {
    console.error('Error generating static paths:', error);
    // Return minimal fallback paths
    return [
      { id: 'sample-id-1', lang: 'en' },
      { id: 'sample-id-1', lang: 'zh' },
    ];
  }
} 