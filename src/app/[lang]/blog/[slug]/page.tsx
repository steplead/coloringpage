import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog/blogService';
import { getColoringPageById } from '@/lib/gallery/galleryService';
import FAQSection from '@/components/blog/FAQSection';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string, lang: string } }): Promise<Metadata> {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === params.lang)?.code || 'en';
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  const translations = await getTranslations(lang);
  const tMeta = (key: string, fallback: string) => getTranslationSync(key, undefined, translations, fallback);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  
  // Primary keyword helps with SEO
  const primaryKeyword = post.seo_data?.primaryKeyword || 
    (post.tags && post.tags.length > 0 ? post.tags[0] : tMeta('common.coloringPages', 'coloring pages'));
  
  // Secondary keywords for added relevance
  const secondaryKeywords = post.tags || [];
  
  // Optimized title with primary keyword at start
  const title = tMeta('blogPost.metaTitleTemplate', '%s | Printable %s | AI Coloring Page').replace('%s', post.title).replace('%s', primaryKeyword);
  
  // Optimized description with keywords and benefit
  const description = post.meta_description || 
    tMeta('blogPost.metaDescriptionTemplate', 'Download this free printable %s coloring page. Specifically designed with detailed elements for creativity and relaxation. Perfect for all skill levels.').replace('%s', primaryKeyword);
  
  return {
    title: title,
    description: description,
    keywords: [primaryKeyword, ...secondaryKeywords].join(', '),
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.created_at,
      authors: [tMeta('common.appNameShort', 'AI Coloring Page Team')],
      tags: post.tags,
      images: [
        {
          url: post.featured_image_url || `${siteUrl}/images/og-default.jpg`,
          alt: tMeta('blogPost.ogImageAltTemplate', '%s - Printable Coloring Page').replace('%s', post.title),
          width: 1200,
          height: 630,
        },
      ],
      locale: lang,
      siteName: tMeta('common.appName', 'AI Coloring Page Generator'),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [post.featured_image_url || `${siteUrl}/images/og-default.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/${lang}/blog/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Revalidate content every hour for freshness
export const revalidate = 3600; // seconds

// Function to generate default FAQs (remains mostly the same, but use t for fallbacks)
function generateDefaultFAQs(title: string, keyword: string, t: (key: string, fallback: string) => string): Array<{question: string, answer: string}> {
  return [
    {
      question: t('blogPost.faqDefault.q1', `What is this ${keyword} coloring page about?`).replace('%s', keyword),
      answer: t('blogPost.faqDefault.a1', `This coloring page features ${title}. It's designed for relaxation and creativity for both kids and adults.`).replace('%s', title)
    },
    {
      question: t('blogPost.faqDefault.q2', `Is this ${keyword} coloring page free to download?`).replace('%s', keyword),
      answer: t('blogPost.faqDefault.a2', 'Yes, absolutely! You can download and print this coloring page for free for personal use.')
    },
    {
      question: t('blogPost.faqDefault.q3', `What materials are best for this ${keyword} coloring page?`).replace('%s', keyword),
      answer: t('blogPost.faqDefault.a3', 'You can use crayons, colored pencils, markers, or even watercolors. Choose whatever materials you enjoy the most!')
    }
  ];
}

export default async function BlogPostPage({ params }: { params: { slug: string, lang: string } }) {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === params.lang)?.code || 'en';
  
  // Fetch post, related data, and translations concurrently
  const [post, translations] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getTranslations(lang)
  ]);
  
  if (!post) {
    notFound();
  }
  
  // Implement the t helper function
  const t = (key: string, fallback?: string, options?: Record<string, string | number>) => {
    return getTranslationSync(key, options, translations, fallback || key.split('.').pop());
  };

  // Fetch related data after confirming post exists
  const [relatedPosts, relatedColoringPage] = await Promise.all([
      getRelatedBlogPosts(post.id, post.tags || []),
      post.related_coloring_page_id ? getColoringPageById(post.related_coloring_page_id) : Promise.resolve(null)
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  const currentPageUrl = `${siteUrl}/${lang}/blog/${post.slug}`;
  
  // Format the publish date for display and SEO
  const formattedPublishDate = new Date(post.created_at).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const isoDate = new Date(post.created_at).toISOString();
  
  // Calculate estimated reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Extract FAQs or generate defaults using t
  const faqs = post.seo_data?.faqSchema || generateDefaultFAQs(post.title, post.tags?.[0] || t('common.coloringPage', 'coloring page'), t);
  
  // Primary keyword for SEO
  const primaryKeyword = post.seo_data?.primaryKeyword || 
    (post.tags && post.tags.length > 0 ? post.tags[0] : t('common.coloringPage', 'coloring page'));

  // --- Define custom components for ReactMarkdown ---
  const components = {
    h1: (props: React.ComponentPropsWithoutRef<'h1'>) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0" {...props} />,
    h2: (props: React.ComponentPropsWithoutRef<'h2'>) => <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6" {...props} />,
    h3: (props: React.ComponentPropsWithoutRef<'h3'>) => <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-5" {...props} />,
    p: (props: React.ComponentPropsWithoutRef<'p'>) => <p className="text-base text-gray-700 leading-relaxed mb-4" {...props} />,
    ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc list-inside mb-4 pl-4 space-y-2" {...props} />,
    ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal list-inside mb-6 pl-4 space-y-3" {...props} />,
    li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="text-gray-700" {...props} />,
    strong: (props: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold" {...props} />,
    a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    img: (props: React.ComponentPropsWithoutRef<'img'>) => (
        <Image 
            src={props.src || ''} 
            alt={props.alt || t('blogPost.imageAltFallback', 'Blog post image')} 
            width={700}
            height={400}
            className="rounded-lg shadow-md my-6 mx-auto max-w-full h-auto" 
            sizes="(max-width: 768px) 100vw, 700px"
        />
    ),
  };
  // --- End of custom components ---
  
  // Prepare structured data with translations
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || t('blogPost.metaDescriptionTemplate', 'Download this free printable %s coloring page...').replace('%s', primaryKeyword),
    image: post.featured_image_url || `${siteUrl}/images/og-default.jpg`,
    datePublished: isoDate,
    dateModified: isoDate,
    author: {
      '@type': 'Organization',
      name: t('common.appNameShort', 'AI Coloring Page Team'),
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: t('common.appName', 'AI Coloring Page Generator'),
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentPageUrl,
    },
    keywords: post.tags?.join(', '),
    wordCount: wordCount,
    articleSection: primaryKeyword,
  };

  const faqSchema = (faqs && faqs.length > 0) ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  const imageSchema = post.featured_image_url ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: post.featured_image_url,
    name: post.title,
    description: post.meta_description,
    caption: t('blogPost.imageCaptionTemplate', '%s - AI Coloring Page').replace('%s', post.title),
    creditText: t('common.appName', 'AI Coloring Page'),
    creator: {
      '@type': 'Organization',
      name: t('common.appName', 'AI Coloring Page'),
      url: siteUrl,
    },
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t('breadcrumb.home', "Home"), "item": `${siteUrl}/${lang}` },
      { "@type": "ListItem", "position": 2, "name": t('breadcrumb.blog', "Blog"), "item": `${siteUrl}/${lang}/blog` },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": currentPageUrl }
    ]
  };
  
  return (
    <div className="bg-gray-50 py-12 md:py-16">
      {/* Structured Data Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {imageSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />}
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 md:mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* === Add Featured Image Here === */}
          {post.featured_image_url && (
            <div className="mb-8 aspect-video relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={post.featured_image_url}
                alt={t('blogPost.featuredImageAlt', '%s - Featured Image').replace('%s', post.title)}
                fill
                style={{ objectFit: 'cover' }} // Use fill and objectFit for responsiveness
                sizes="(max-width: 1024px) 100vw, 896px" // 896px is max-w-4xl
                priority // Prioritize loading the main image
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.svg'; }} // Fallback on error
              />
            </div>
          )}
          {/* === End Featured Image === */}

          <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span itemProp="datePublished" content={isoDate}>{formattedPublishDate}</span>
              <span>·</span>
              <span>{t('blogPost.readingTime', '%d min read', { d: readingTime })}</span>
            </div>

            {/* Tags with links */}
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.map((tag: string) => (
                <Link 
                  key={tag} 
                  href={`/${lang}/blog/tag/${encodeURIComponent(tag)}`}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Post Content - Rendered with ReactMarkdown */}
        <div className="prose prose-lg max-w-none prose-blue prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-800" itemProp="articleBody">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share Buttons */}
        <div className="mt-8">
          <ShareButtons url={currentPageUrl} title={post.title} />
        </div>

        {/* Related Coloring Page */}
        {relatedColoringPage && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">{t('blog.relatedColoringPage')}</h2>
            <Link href={`/${params.lang}/gallery/${relatedColoringPage.id}`} className="block w-full max-w-sm mx-auto group">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-md mb-3 group-hover:opacity-90 transition-opacity">
                <Image 
                  // Ensure only image_url is used
                  src={relatedColoringPage.image_url} 
                  alt={relatedColoringPage.prompt || t('blog.relatedColoringPageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 500px"
                />
              </div>
              <p className="text-lg font-medium text-blue-600 group-hover:underline">{t('blog.viewColoringPage')}</p>
            </Link>
          </div>
        )}

        {/* FAQ Section */}
        {post.seo_data?.faqSchema && post.seo_data.faqSchema.length > 0 && (
          <div className="mt-12">
            <FAQSection faqs={post.seo_data.faqSchema} />
          </div>
        )}

        {/* Related Blog Posts */}
        <div className="mt-16">
          <RelatedPosts 
            posts={relatedPosts} 
            locale={lang}
          />
        </div>
      </article>
    </div>
  );
} 