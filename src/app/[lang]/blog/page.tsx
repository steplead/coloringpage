import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { truncateText, stripHtml } from '@/utils/string';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { Metadata } from 'next';

// Define metadata for SEO
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  const translations = await getTranslations(params.lang);
  const t = (key: string, fallback?: string): string => {
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };
  
  return {
    title: t('blog.meta.title', 'Coloring Page Blog | Tips, Ideas & Educational Activities'),
    description: t('blog.meta.description', 'Discover creative coloring activities, educational benefits, and coloring tips for kids and adults. Free printable resources for parents and teachers.'),
    keywords: t('blog.meta.keywords', 'coloring pages, coloring activities, kids activities, educational coloring, printable coloring pages, coloring benefits'),
    openGraph: {
      title: t('blog.og.title', 'Coloring Page Blog | Tips & Educational Activities'),
      description: t('blog.og.description', 'Discover creative coloring activities, educational benefits, and coloring tips for kids and adults.'),
      url: `${siteUrl}/${params.lang}/blog`,
      siteName: t('common.appName', 'AI Coloring Page Generator'),
      images: [
        {
          url: `${siteUrl}/images/blog-og.png`,
          width: 1200,
          height: 630,
          alt: t('blog.og.imageAlt', 'AI Coloring Page Blog Cover')
        }
      ],
      locale: params.lang,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('blog.twitter.title', 'Coloring Page Blog | Tips & Activities'),
      description: t('blog.twitter.description', 'Creative coloring activities, educational benefits, and printable resources.')
    },
    alternates: {
      canonical: `${siteUrl}/blog`
    }
  };
}

// Revalidate content every hour to ensure fresh content
export const revalidate = 3600; // seconds

// Define BlogPost type for TypeScript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  tags: string[];
  created_at: string;
}

/**
 * Get blog posts from Supabase
 */
async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(12);
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    return data as BlogPost[];
  } catch (err) {
    console.error('Failed to fetch blog posts:', err);
    return [];
  }
}

/**
 * Main blog listing page component
 */
export default async function BlogPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  // Fetch blog posts and translations concurrently
  const [blogPosts, translations] = await Promise.all([
    getBlogPosts(),
    getTranslations(lang)
  ]);

  // Helper function for translations
  const t = (key: string, fallback?: string): string => {
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };
  
  // Prepare structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": t('blog.structuredData.name', "Coloring Page Blog"),
    "description": t('blog.structuredData.description', "Discover creative coloring activities, educational benefits, and coloring tips for kids and adults."),
    "url": `${siteUrl}/${lang}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": t('common.appName', "AI Coloring Page Generator"),
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` }
    },
    "mainEntity": {
        "@type": "ItemList",
        "itemListElement": blogPosts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${siteUrl}/${lang}/blog/${post.slug}`,
          "name": post.title
        }))
    }
  };
  
  // Prepare breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t('breadcrumb.home', "Home"), "item": `${siteUrl}/${lang}` },
      { "@type": "ListItem", "position": 2, "name": t('breadcrumb.blog', "Blog"), "item": `${siteUrl}/${lang}/blog` }
    ]
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      
      {/* --- New Header Section --- */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 py-20 px-4 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute -top-16 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl"></div>
           <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
         </div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
             {t('blog.title', "Coloring Page Blog")}
           </h1>
           <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
             {t('blog.description', "Discover creative coloring activities, educational benefits, and coloring tips for kids and adults.")}
           </p>
         </div>
       </div>
      
      <section aria-labelledby="latest-articles-heading" className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* --- Section Header --- */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200">
          <div>
            <h2 id="latest-articles-heading" className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('blog.latestArticles', "Latest Articles")}
            </h2>
            <p className="mt-2 text-base text-gray-600">
              {t('blog.exploreIdeas', "Explore ideas, tips, and inspiration for coloring activities")}
            </p>
          </div>
          <Link 
            href={`/${lang}/create`}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-shrink-0 transition-all transform hover:scale-105"
          >
             <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" /></svg>
            {t('common.createColoringPage', "Create Coloring Page")}
          </Link>
        </div>

        {/* --- Blog Post Grid --- */}
        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/${lang}/blog/${post.slug}`} 
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100 flex flex-col transform hover:-translate-y-1"
              >
                {post.featured_image_url && (
                  <div className="relative h-56 w-full flex-shrink-0 overflow-hidden">
                    <Image
                      src={post.featured_image_url}
                      alt={post.title || 'Blog post feature image'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-5 line-clamp-3 text-sm flex-grow">
                    {post.meta_description || truncateText(stripHtml(post.content), 120)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags && post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center text-indigo-600 group-hover:text-indigo-800 font-medium text-sm">
                      {t('common.readMore', "Read more")}
                      <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                    </span>
                    <time dateTime={post.created_at} className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString(lang, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md border border-gray-100 mt-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {t('blog.noPosts', "No Blog Posts Yet")}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('blog.stayTuned', "Stay tuned for upcoming articles about coloring activities, benefits, and creative ideas!")}
            </p>
             <Link 
               href={`/${lang}/create`}
               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
             >
               {t('common.createColoringPage', "Create Coloring Page")}
             </Link>
          </div>
        )}
      </section>
    </div>
  );
} 