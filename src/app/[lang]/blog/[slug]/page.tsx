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

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string, lang: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  // Primary keyword helps with SEO
  const primaryKeyword = post.seo_data?.primaryKeyword || 
    (post.tags && post.tags.length > 0 ? post.tags[0] : 'coloring pages');
  
  // Secondary keywords for added relevance
  const secondaryKeywords = post.tags || [];
  
  // Optimized title with primary keyword at start
  const title = `${post.title} | Printable ${primaryKeyword} | AI Coloring Page`;
  
  // Optimized description with keywords and benefit
  const description = post.meta_description || 
    `Download this free printable ${primaryKeyword} coloring page. Specifically designed with detailed elements for creativity and relaxation. Perfect for all skill levels.`;
  
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
      authors: ['AI Coloring Page Team'],
      tags: post.tags,
      images: [
        {
          url: post.featured_image_url || '/images/og-default.jpg',
          alt: `${post.title} - Printable Coloring Page`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
    title: post.title,
      description: description,
      images: [post.featured_image_url || '/images/og-default.jpg'],
    },
    alternates: {
      canonical: `https://ai-coloringpage.com/${params.lang}/blog/${params.slug}`,
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

export default async function BlogPostPage({ params }: { params: { slug: string, lang: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedBlogPosts(post.id, post.tags || []);
  const relatedColoringPage = post.related_coloring_page_id 
    ? await getColoringPageById(post.related_coloring_page_id) 
    : null;
  
  // Format the publish date for display and SEO
  const formattedPublishDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const isoDate = new Date(post.created_at).toISOString();
  
  // Calculate estimated reading time - approximately 200 words per minute
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Extract FAQs if available
  const faqs = post.seo_data?.faqSchema || generateDefaultFAQs(post.title, post.tags?.[0] || 'coloring page');
  
  // Primary keyword for SEO
  const primaryKeyword = post.seo_data?.primaryKeyword || 
    (post.tags && post.tags.length > 0 ? post.tags[0] : 'coloring page');

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
    a: (props: React.ComponentPropsWithoutRef<'a'>) => <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />,
    // Add more custom components as needed (e.g., for blockquotes, code blocks)
  };
  // --- End of custom components ---
  
  return (
    <div className="bg-gray-50 min-h-screen" itemScope itemType="https://schema.org/Article">
      {/* Schema.org metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.meta_description,
            image: post.featured_image_url,
            datePublished: isoDate,
            dateModified: isoDate,
            author: {
              '@type': 'Organization',
              name: 'AI Coloring Page Team',
              url: 'https://ai-coloringpage.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'AI Coloring Page',
              logo: {
                '@type': 'ImageObject',
                url: 'https://ai-coloringpage.com/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://ai-coloringpage.com/${params.lang}/blog/${post.slug}`,
            },
            keywords: post.tags?.join(', '),
            wordCount: wordCount,
            articleSection: primaryKeyword,
          })
        }}
      />
      
      {/* FAQPage schema if FAQs exist */}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      )}
      
      {/* ImageObject schema */}
      {post.featured_image_url && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              contentUrl: post.featured_image_url,
              name: post.title,
              description: post.meta_description,
              caption: `${post.title} - AI Coloring Page`,
              creditText: 'AI Coloring Page',
              creator: {
                '@type': 'Organization',
                name: 'AI Coloring Page',
                url: 'https://ai-coloringpage.com',
              },
            })
          }}
        />
      )}
      
      <article className="max-w-4xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          {/* Post Metadata */}
          <header className="mb-8 pb-4 border-b border-gray-200">
            {/* Breadcrumbs for SEO and navigation */}
            <nav className="text-sm mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center">
                <li className="flex items-center">
                  <Link href={`/${params.lang}`} className="text-gray-500 hover:text-blue-600">
                    Home
                  </Link>
                  <svg className="mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="flex items-center">
                  <Link href={`/${params.lang}/blog`} className="text-gray-500 hover:text-blue-600">
                    Blog
                  </Link>
                  <svg className="mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-gray-700">
                  {post.title}
                </li>
              </ol>
            </nav>
            
            {/* SEO-optimized H1 tag with primary keyword */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3" itemProp="headline">{post.title}</h1>
            
            {/* Tags with links - good for SEO and internal linking */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags && post.tags.map((tag: string) => (
                <Link 
                  key={tag} 
                  href={`/${params.lang}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            {/* Author, date and reading time with structured data attributes */}
            <div className="flex items-center text-gray-500 text-sm">
              <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                By <span itemProp="name">AI Coloring Page Team</span>
              </span>
              <span className="mx-2">•</span>
              <time dateTime={isoDate} itemProp="datePublished">
                {formattedPublishDate}
              </time>
              <span className="mx-2">•</span>
              <span>{readingTime} min read</span>
            </div>
          </header>
          
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-3/4">
              {/* Featured Image with optimized alt text */}
              {post.featured_image_url && (
                <div className="mb-8">
                  <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden shadow-md">
                    <Image 
                      src={post.featured_image_url} 
                      alt={`${post.title} - Printable ${primaryKeyword} coloring page with detailed design for all ages`} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                      itemProp="image"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 italic text-center">{post.title} - Free Printable Coloring Page</p>
                </div>
              )}
              
              {/* Post Content - Rendered with ReactMarkdown */}
              <div className="mb-8" itemProp="articleBody">
                <ReactMarkdown
                  components={components}
                  remarkPlugins={[remarkGfm]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              
              {/* Call to Action - Download Section */}
              <div className="my-8 p-6 bg-green-50 rounded-lg border border-green-100">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Download This Coloring Page</h2>
                <p className="mb-4">Get your free printable {primaryKeyword} coloring page now and start your creative journey!</p>
                {relatedColoringPage ? (
                  <Link
                    href={`/${params.lang}/gallery/${relatedColoringPage.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download Free Coloring Page
                  </Link>
                ) : (
                  <Link
                    href={`/${params.lang}/gallery`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Browse All Coloring Pages
                  </Link>
                )}
              </div>
              
              {/* FAQ Section - Good for SEO and user engagement */}
              {faqs && faqs.length > 0 && (
                <FAQSection faqs={faqs} className="my-8" />
              )}
            </div>
            
            <aside className="lg:w-1/4">
              {/* Sticky sidebar with related content */}
              <div className="sticky top-24">
                {/* Share buttons */}
                <ShareButtons 
                  title={post.title} 
                  url={`https://coloringpage.app/${params.lang}/blog/${post.slug}`} 
                  className="mb-6"
                />
                
                {/* Featured coloring page */}
                {relatedColoringPage && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Try This Coloring Page</h3>
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-sm mb-3">
                      <Image
                        src={relatedColoringPage.image_url}
                        alt={relatedColoringPage.title || `${primaryKeyword} coloring page`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                    <Link
                      href={`/${params.lang}/gallery/${relatedColoringPage.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Download Now
                      <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
                
                {/* Popular tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Animals', 'Nature', 'Fantasy', 'Educational', 'Seasonal', 'Characters'].map(tag => (
                      <Link 
                        key={tag} 
                        href={`/${params.lang}/blog/tag/${tag.toLowerCase()}`}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        
        {/* Related Posts - Good for keeping users on the site and internal linking */}
        {relatedPosts.length > 0 && (
          <RelatedPosts 
            posts={relatedPosts} 
            locale={params.lang}
          />
        )}
        
        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link 
            href={`/${params.lang}/blog`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}

// Helper function to generate default FAQs (keep as is)
function generateDefaultFAQs(title: string, keyword: string): Array<{question: string, answer: string}> {
  return [
    {
      question: `How do I print this ${keyword} coloring page?`,
      answer: `To print this ${title} coloring page, simply click the "Download" button above. Once downloaded, open the image and select "Print" from your device. For best results, use high-quality paper and ensure your printer settings are set to "Fit to Page" or "Actual Size".`
    },
    {
      question: `What coloring supplies work best for this ${keyword} coloring page?`,
      answer: `For this ${title} coloring page, you can use colored pencils, markers, crayons, or even watercolors. Colored pencils are ideal for the detailed areas, while markers create bold, vibrant colors. Children might prefer crayons for their ease of use, while adults might enjoy experimenting with watercolors for a more artistic finish.`
    },
    {
      question: `Is this ${keyword} coloring page suitable for children?`,
      answer: `Yes, this ${title} coloring page is designed to be suitable for all ages. It contains detailed elements that can be enjoyed by adults, while also having simpler areas that are perfect for children. It's a versatile design that can grow with the skills of the colorist.`
    },
    {
      question: `Can I use this ${keyword} coloring page for educational purposes?`,
      answer: `Absolutely! This ${title} coloring page is perfect for educational settings. Teachers and parents can use it to teach about colors, develop fine motor skills, practice focus and concentration, and even incorporate it into lessons about the subject matter of the design. It's a great educational resource for classrooms, homeschooling, or family activities.`
    }
  ];
} 