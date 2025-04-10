import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';

// Default settings
const DEFAULT_POST_COUNT = 1;
const DEFAULT_POST_LENGTH = 1200;

// Read configuration from environment variables if available
const getConfig = () => {
  return {
    postCount: process.env.AUTO_BLOG_POST_COUNT ? parseInt(process.env.AUTO_BLOG_POST_COUNT) : DEFAULT_POST_COUNT,
    postLength: process.env.AUTO_BLOG_POST_LENGTH ? parseInt(process.env.AUTO_BLOG_POST_LENGTH) : DEFAULT_POST_LENGTH
  };
};

// Blog topics for automatic generation - enhanced with more targeted keywords for SEO
const blogTopics = [
  'Educational dinosaur coloring pages for preschoolers',
  'Mindfulness coloring pages for stress relief',
  'Animal coloring pages with fun facts for kids',
  'Holiday-themed coloring activities for family time',
  'Ocean animals coloring pages with educational content',
  'Space and planets coloring pages for science learning',
  'Seasonal nature coloring pages for children',
  'Fairy tale coloring pages with storytelling prompts',
  'Transportation coloring pages for toddlers',
  'Farm animals coloring pages with learning activities',
  'Motivational quote coloring pages for teens',
  'STEM-themed coloring pages for elementary students',
  'World cultures coloring pages with geography facts',
  'Food and nutrition coloring pages for health education',
  'Alphabet and number coloring pages for early literacy',
];

// Get random topics from the list
function getRandomTopics(count: number): string[] {
  const shuffled = [...blogTopics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Extract keywords from a topic for better SEO
 */
function extractKeywords(topic: string): string[] {
  // Convert to lowercase and remove common stop words
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'for', 'with', 'in', 'on', 'at', 'to', 'of'];
  
  // Extract and filter words
  const words = topic.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 3) // Only include words longer than 3 chars
    .filter(word => !stopWords.includes(word)); // Remove stop words
  
  // Add some related coloring keywords
  const coloringKeywords = ['coloring', 'printable', 'pages', 'activities', 'educational', 'kids'];
  
  // Combine and remove duplicates
  const combined = [...words, ...coloringKeywords];
  const uniqueKeywords = Array.from(new Set(combined));
  
  // Return up to 10 keywords
  return uniqueKeywords.slice(0, 10);
}

/**
 * Generate SEO-friendly tags from keywords
 */
function generateTags(keywords: string[]): string[] {
  // Add some standard tags
  const standardTags = ['coloring pages', 'printable', 'activities', 'kids activities'];
  
  // Combine with keywords
  const combined = [...standardTags, ...keywords];
  
  // Create compound tags
  const compoundTags = keywords.map(kw => `${kw} coloring pages`);
  
  // Combine all tags and make unique
  const allTags = [...standardTags, ...combined, ...compoundTags];
  const uniqueTags = Array.from(new Set(allTags));
  
  // Return up to 8 tags
  return uniqueTags.slice(0, 8);
}

/**
 * Find related image for the blog post
 */
async function findRelatedImage(keywords: string[]) {
  // Try to find an image that matches at least one keyword
  for (const keyword of keywords) {
    const { data, error } = await supabase
      .from('images')
      .select('id, image_url')
      .ilike('prompt', `%${keyword}%`)
      .limit(5);
    
    if (!error && data && data.length > 0) {
      return data[Math.floor(Math.random() * data.length)];
    }
  }
  
  // If no matches found, just get a random image
  const { data } = await supabase
    .from('images')
    .select('id, image_url')
    .order('created_at', { ascending: false })
    .limit(10);
    
  return data && data.length > 0 ? data[Math.floor(Math.random() * data.length)] : null;
}

/**
 * GET handler for scheduled blog post generation
 * This endpoint is designed to be called by a cron job service like Vercel Cron
 */
export async function GET(request: NextRequest) {
  const config = getConfig();
  const topics = getRandomTopics(config.postCount);
  let successCount = 0;
  const results = [];

  try {
    for (const topic of topics) {
      try {
        console.log(`Generating blog post for topic: ${topic}`);
        
        // Generate blog post content using Gemini
        const blogContent = await generateBlogPost(topic, config.postLength);
        
        if (!blogContent) {
          results.push({ topic, success: false, error: 'Failed to generate content' });
          continue;
        }
        
        // Extract content components
        const { title, content, description } = blogContent;
        
        // Create a slug from the title
        const slug = createSlug(title);
        
        // Extract keywords for SEO
        const keywords = extractKeywords(topic);
        
        // Generate tags
        const tags = generateTags(keywords);
        
        // Find related image
        const relatedImage = await findRelatedImage(keywords);
        const featuredImageUrl = relatedImage?.image_url;
        const relatedImageId = relatedImage?.id;
        
        // Create additional SEO data
        const seoData = {
          keywords: keywords,
          primaryKeyword: topic,
          canonicalUrl: `/blog/${slug}`,
          structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": featuredImageUrl,
            "author": {
              "@type": "Organization",
              "name": "AI Coloring Page"
            },
            "publisher": {
              "@type": "Organization",
              "name": "AI Coloring Page",
              "logo": {
                "@type": "ImageObject",
                "url": "https://ai-coloringpage.com/logo.png"
              }
            },
            "datePublished": new Date().toISOString()
          }
        };
        
        // Insert into database
        const { error } = await supabase.from('blog_posts').insert({
          title,
          slug,
          content,
          meta_description: description,
          featured_image_url: featuredImageUrl,
          related_coloring_page_id: relatedImageId,
          tags,
          is_published: true,
          seo_data: seoData
        });
        
        if (error) {
          console.error('Error inserting blog post:', error);
          results.push({ topic, success: false, error: error.message });
        } else {
          successCount++;
          results.push({ topic, success: true, slug });
          console.log(`Successfully created blog post: ${title} (${slug})`);
        }
      } catch (err: any) {
        console.error(`Error generating blog post for topic "${topic}":`, err);
        results.push({ topic, success: false, error: err.message });
      }
    }
    
    return NextResponse.json({
      success: true,
      generated: successCount,
      failed: topics.length - successCount,
      results,
      config
    });
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      generated: successCount,
      config 
    }, { status: 500 });
  }
} 