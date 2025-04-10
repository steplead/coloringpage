import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import TranslatedText from '@/components/TranslatedText';
import BlogPostTemplate, { BlogPostTemplateProps, generateBlogMetadata } from '@/lib/blog/postTemplate';

// Types for blog posts
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  related_coloring_page_id?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  seo_data?: {
    keywords?: string[];
    primaryKeyword?: string;
    canonicalUrl?: string;
    structuredData?: any;
  };
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string, lang: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  // Convert from database format to template format
  const templateData = convertToTemplateFormat(post, params.lang);
  
  // Use our standardized metadata generator
  return generateBlogMetadata(templateData);
}

// Revalidate content every hour
export const revalidate = 3600; // seconds

// Get blog post by slug from Supabase
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    
    return data as BlogPost;
  } catch (err) {
    console.error('Exception fetching blog post:', err);
    return null;
  }
}

// Get related blog posts based on tags
async function getRelatedBlogPosts(currentPostId: string, tags: string[]): Promise<BlogPost[]> {
  try {
    // Select posts that have at least one matching tag but are not the current post
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .neq('id', currentPostId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
    
    // Sort by tag relevance (number of matching tags)
    return (data as BlogPost[]).sort((a, b) => {
      const aMatchCount = a.tags.filter((tag: string) => tags.includes(tag)).length;
      const bMatchCount = b.tags.filter((tag: string) => tags.includes(tag)).length;
      return bMatchCount - aMatchCount;
    });
  } catch (err) {
    console.error('Exception fetching related posts:', err);
    return [];
  }
}

// Interface for coloring page data
interface ColoringPage {
  id: string;
  image_url: string;
  title?: string;
  prompt: string;
}

// Get coloring page by ID
async function getColoringPageById(id: string): Promise<ColoringPage | null> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching coloring page:', error);
      return null;
    }
    
    return data as ColoringPage;
  } catch (err) {
    console.error('Exception fetching coloring page:', err);
    return null;
  }
}

// Convert database blog post to template format
function convertToTemplateFormat(post: BlogPost, lang: string): BlogPostTemplateProps {
  // Extract primary keyword from seo_data or use first tag
  const primaryKeyword = post.seo_data?.primaryKeyword || (post.tags && post.tags.length > 0 ? post.tags[0] : 'coloring pages');
  
  // Create sections from content
  // This is a simple implementation, in a real scenario you would parse the HTML content
  // and convert it to discrete sections
  const contentSections = post.content 
    ? [{
        heading: 'Overview',
        content: post.content,
      }]
    : [];

  // Extract FAQ data if available
  // In a real scenario, you'd parse structured content for FAQs
  const faqs = post.seo_data?.structuredData?.['@type'] === 'FAQPage' 
    ? post.seo_data.structuredData.mainEntity?.map((item: any) => ({
        question: item.name,
        answer: item.acceptedAnswer.text
      }))
    : undefined;
  
  return {
    title: post.title,
    metaDescription: post.meta_description,
    slug: post.slug,
    primaryKeyword: primaryKeyword,
    secondaryKeywords: post.seo_data?.keywords || post.tags || [],
    featuredImageUrl: post.featured_image_url || `https://ai-coloringpage.com/images/blog/default.jpg`,
    featuredImageAlt: `${post.title} - AI Coloring Page`,
    authorName: 'AI Coloring Page Team',
    publishDate: post.created_at,
    modifiedDate: post.created_at,
    category: (post.tags && post.tags.length > 0) ? post.tags[0] : 'Coloring Techniques',
    tags: post.tags || [],
    coloringPageExamples: [],  // Will be populated if relatedColoringPage is available
    sections: contentSections,
    faqs: faqs,
    conclusion: `<p>We hope you enjoyed this article about ${primaryKeyword}. Remember that coloring is not just a fun activity, but also a great way to relieve stress and express creativity.</p>`,
    callToAction: `<p>Ready to try your hand at coloring? Use our AI Coloring Page Generator to create custom designs that match your interests!</p>`,
    relatedPosts: [] // Will be populated with related posts
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string, lang: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedBlogPosts(post.id, post.tags || []);
  const relatedColoringPage = post.related_coloring_page_id 
    ? await getColoringPageById(post.related_coloring_page_id) 
    : null;
  
  // Convert to template format
  const templateData = convertToTemplateFormat(post, params.lang);
  
  // Add related coloring page to template data
  if (relatedColoringPage) {
    templateData.coloringPageExamples = [{
      url: relatedColoringPage.image_url,
      title: relatedColoringPage.title || relatedColoringPage.prompt,
      alt: `${relatedColoringPage.title || relatedColoringPage.prompt} - Coloring Page`
    }];
  }
  
  // Add related posts to template data
  templateData.relatedPosts = relatedPosts.map(relatedPost => ({
    title: relatedPost.title,
    slug: relatedPost.slug
  }));
  
  // Return the standardized blog post template
  return <BlogPostTemplate {...templateData} />;
} 