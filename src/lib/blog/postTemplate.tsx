import React from 'react';
import { Metadata } from 'next';
import Schema from '@/components/Schema';

export interface BlogPostTemplateProps {
  title: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  featuredImageUrl: string;
  featuredImageAlt: string;
  authorName: string;
  publishDate: string;
  modifiedDate: string;
  category: string;
  tags: string[];
  coloringPageExamples: Array<{url: string, title: string, alt: string}>;
  sections: Array<{
    heading: string;
    content: string;
    imageUrl?: string;
    imageAlt?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  conclusion: string;
  callToAction: string;
  relatedPosts?: Array<{
    title: string;
    slug: string;
  }>;
}

export const generateBlogMetadata = (post: BlogPostTemplateProps): Metadata => {
  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.modifiedDate,
      authors: [post.authorName],
      tags: post.tags,
      images: [
        {
          url: post.featuredImageUrl,
          alt: post.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [post.featuredImageUrl],
    },
    alternates: {
      canonical: `https://ai-coloringpage.com/blog/${post.slug}`,
    },
  };
};

export const BlogPostTemplate: React.FC<BlogPostTemplateProps> = (post) => {
  // Format the publish date for display
  const formattedPublishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Schema.org Markup */}
      <Schema
        type="Article"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription,
          image: post.featuredImageUrl,
          datePublished: post.publishDate,
          dateModified: post.modifiedDate,
          author: {
            '@type': 'Person',
            name: post.authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AI Coloring Page Generator',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ai-coloringpage.com/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://ai-coloringpage.com/blog/${post.slug}`,
          },
        }}
      />

      {/* Add FAQ Schema if FAQs exist */}
      {post.faqs && post.faqs.length > 0 && (
        <Schema
          type="FAQPage"
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }}
        />
      )}

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Tag */}
        <div className="text-sm text-blue-600 font-semibold mb-2">
          {post.category}
        </div>
        
        {/* Title - H1 with Primary Keyword */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* Author and Date */}
        <div className="flex items-center text-gray-600 mb-4">
          <span>By {post.authorName} • {formattedPublishDate}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Featured Image with Alt Text */}
        <div className="mb-6">
          <img 
            src={post.featuredImageUrl} 
            alt={post.featuredImageAlt} 
            className="w-full h-auto rounded-lg shadow-md"
            width={800}
            height={450}
          />
        </div>
        
        {/* Introduction - Include Primary Keyword */}
        <div className="text-lg text-gray-700 leading-relaxed mb-6">
          <p className="mb-4">
            {/* First paragraph with primary keyword early */}
            Welcome to our guide on <strong>{post.primaryKeyword}</strong>. This article will provide you with valuable insights, practical tips, and creative ideas to enhance your coloring experience.
          </p>
        </div>
        
        {/* Table of Contents */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Table of Contents</h2>
          <ol className="list-decimal pl-5">
            {post.sections.map((section, index) => (
              <li key={index} className="mb-1">
                <a 
                  href={`#section-${index + 1}`} 
                  className="text-blue-600 hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
            <li className="mb-1">
              <a href="#conclusion" className="text-blue-600 hover:underline">
                Conclusion
              </a>
            </li>
            {post.faqs && post.faqs.length > 0 && (
              <li className="mb-1">
                <a href="#faqs" className="text-blue-600 hover:underline">
                  Frequently Asked Questions
                </a>
              </li>
            )}
          </ol>
        </div>
      </header>

      {/* Main Content with Proper H2/H3 Structure */}
      <div className="prose max-w-none">
        {/* Content Sections */}
        {post.sections.map((section, index) => (
          <section key={index} id={`section-${index + 1}`} className="mb-10">
            {/* H2 Headings with Secondary Keywords */}
            <h2 className="text-2xl font-bold mb-4">{section.heading}</h2>
            
            {/* Section Content with Short Paragraphs */}
            <div 
              className="text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
            
            {/* Section Image if available */}
            {section.imageUrl && (
              <div className="my-6">
                <img 
                  src={section.imageUrl} 
                  alt={section.imageAlt || `Illustration for ${section.heading}`} 
                  className="w-full h-auto rounded-lg shadow-sm"
                  width={700}
                  height={400}
                  loading="lazy"
                />
              </div>
            )}
          </section>
        ))}

        {/* Coloring Page Examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Free Coloring Page Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {post.coloringPageExamples.map((example, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
                <img 
                  src={example.url} 
                  alt={example.alt} 
                  className="w-full h-auto mb-3 rounded"
                  width={400}
                  height={400}
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                <a 
                  href={`/download?url=${encodeURIComponent(example.url)}&title=${encodeURIComponent(example.title)}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Download This Page
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <a 
              href="/create" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Create Your Own Custom Coloring Page
            </a>
          </div>
        </section>

        {/* FAQ Section if Available */}
        {post.faqs && post.faqs.length > 0 && (
          <section id="faqs" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {post.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-5">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conclusion with Primary Keyword */}
        <section id="conclusion" className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
          <div 
            className="text-gray-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: post.conclusion }}
          />
        </section>

        {/* Call to Action */}
        <section className="bg-blue-50 p-6 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-4">Ready to Start Coloring?</h2>
          <div 
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: post.callToAction }}
          />
          <div className="text-center">
            <a 
              href="/create" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your Free Coloring Page Now
            </a>
          </div>
        </section>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <ul className="space-y-3">
              {post.relatedPosts.map((relatedPost, index) => (
                <li key={index}>
                  <a 
                    href={`/blog/${relatedPost.slug}`}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {relatedPost.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Social Sharing */}
      <div className="border-t pt-6 mt-10">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Share this article:</span>
          <div className="flex space-x-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ai-coloringpage.com/blog/${post.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
              aria-label="Share on Twitter"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ai-coloringpage.com/blog/${post.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              aria-label="Share on Facebook"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ai-coloringpage.com/blog/${post.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
              aria-label="Share on LinkedIn"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: https://ai-coloringpage.com/blog/${post.slug}`)}`} 
              className="text-gray-600 hover:text-gray-800"
              aria-label="Share via Email"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostTemplate; 