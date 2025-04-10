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
  // Parse the HTML content to create proper sections
  let contentSections = [];
  
  if (post.content) {
    // First, try to extract sections based on h2 tags
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let h2Matches = [];
    let match;
    
    // Use exec instead of matchAll for better compatibility
    while ((match = h2Regex.exec(post.content)) !== null) {
      h2Matches.push({
        fullMatch: match[0],
        headingText: match[1],
        index: match.index
      });
    }
    
    if (h2Matches && h2Matches.length > 0) {
      // Get content between h2 tags
      for (let i = 0; i < h2Matches.length; i++) {
        const heading = h2Matches[i].headingText.replace(/<[^>]*>/g, ''); // Remove any HTML tags inside the heading
        let content;
        
        if (i < h2Matches.length - 1) {
          // Get content between this h2 and the next
          const startIdx = h2Matches[i].index + h2Matches[i].fullMatch.length;
          const endIdx = h2Matches[i+1].index;
          content = post.content.substring(startIdx, endIdx);
        } else {
          // Get content after the last h2
          const startIdx = h2Matches[i].index + h2Matches[i].fullMatch.length;
          content = post.content.substring(startIdx);
        }
        
        contentSections.push({
          heading,
          content
        });
      }
    } else {
      // If no h2 tags, check for strong tags or other structure
      // For now, just create a single section
      contentSections = [{
        heading: 'About ' + primaryKeyword,
        content: post.content,
      }];
    }
  } else {
    // If no content at all, create a default section
    contentSections = [{
      heading: 'About ' + primaryKeyword,
      content: `<p>Explore the joy of ${primaryKeyword} with our comprehensive guide. 
      Coloring is a wonderful activity for all ages, offering benefits from stress relief to 
      creative expression.</p>`,
    }];
  }

  // Extract FAQ data if available
  // In a real scenario, you'd parse structured content for FAQs
  const faqs = post.seo_data?.structuredData?.['@type'] === 'FAQPage' 
    ? post.seo_data.structuredData.mainEntity?.map((item: any) => ({
        question: item.name,
        answer: item.acceptedAnswer.text
      }))
    : [
        {
          question: `What are the benefits of ${primaryKeyword}?`,
          answer: `<p>${primaryKeyword} offer numerous benefits, including stress reduction, improved focus, enhanced fine motor skills, and creative expression. Regular coloring has been shown to help reduce anxiety and promote mindfulness.</p>`
        },
        {
          question: `How do I get started with ${primaryKeyword}?`,
          answer: `<p>Getting started with ${primaryKeyword} is easy! Simply download and print the designs you like, gather your favorite coloring supplies (colored pencils, markers, or crayons), and find a comfortable, well-lit space to begin. Start with simpler designs if you're a beginner.</p>`
        }
      ];
  
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
    conclusion: `<p>We hope you enjoyed this article about ${primaryKeyword}. Remember that coloring is not just a fun activity, but also a great way to relieve stress and express creativity. Regular practice can improve focus, patience, and artistic skills for both children and adults.</p>`,
    callToAction: `<p>Ready to try your hand at coloring? Use our AI Coloring Page Generator to create custom ${primaryKeyword} that match your interests! With just a few clicks, you can generate unique designs perfectly suited to your preferences.</p>`,
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