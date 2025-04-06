import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';

// Default settings
const DEFAULT_POST_COUNT = 1;
const DEFAULT_POST_LENGTH = 800;

// Read configuration from environment variables if available
const getConfig = () => {
  return {
    postCount: process.env.AUTO_BLOG_POST_COUNT ? parseInt(process.env.AUTO_BLOG_POST_COUNT) : DEFAULT_POST_COUNT,
    postLength: process.env.AUTO_BLOG_POST_LENGTH ? parseInt(process.env.AUTO_BLOG_POST_LENGTH) : DEFAULT_POST_LENGTH
  };
};

// Blog topics for automatic generation
const blogTopics = [
  'Creative coloring techniques for beginners',
  'Educational benefits of coloring for children',
  'Coloring for stress relief and mindfulness',
  'Using coloring pages in the classroom',
  'How to color with markers and achieve blending effects',
  'Seasonal coloring activities for families',
  'Coloring and cognitive development in children',
  'Adult coloring trends and benefits',
  'Coloring pages for special needs education',
  'Printable coloring pages for different age groups',
  'History of coloring books and coloring pages',
  'Digital vs traditional coloring: pros and cons',
  'Therapeutic benefits of coloring for adults',
  'Using coloring pages to teach art principles',
  'Coloring contests and community activities',
];

// Get random topics from the list
function getRandomTopics(count: number): string[] {
  const shuffled = [...blogTopics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * GET handler for scheduled blog post generation
 * This endpoint is designed to be called by a cron job service like Vercel Cron
 */
export async function GET(request: NextRequest) {
  // Skip actual execution during build time
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined' && process.env.SKIP_API_CALLS_DURING_BUILD === 'true') {
    console.log('Skipping blog cron job during build');
    return NextResponse.json({
      success: true,
      message: 'Skipped during build',
      is_build: true
    });
  }
  
  const config = getConfig();
  const topics = getRandomTopics(config.postCount);
  let successCount = 0;
  const results = [];

  try {
    for (const topic of topics) {
      try {
        // Generate blog post content using Gemini
        const blogContent = await generateBlogPost(topic, config.postLength);
        
        if (!blogContent) {
          results.push({ topic, success: false, error: 'Failed to generate content' });
          continue;
        }
        
        // Extract content from blogContent object
        const { title, content: bodyContent, description: metaDescription } = blogContent;
        
        // Create a slug from the title
        const slug = createSlug(title);
        
        // Choose a random featured image from existing images
        const { data: images } = await supabase
          .from('images')
          .select('image_url')
          .limit(10);
        
        const featuredImageUrl = images && images.length > 0
          ? images[Math.floor(Math.random() * images.length)].image_url
          : undefined;
        
        // Extract keywords for tags
        const keywords = topic.toLowerCase().split(' ')
          .filter(word => word.length > 3)
          .map(word => word.replace(/[^a-z0-9]/g, ''));
        
        // Add some standard tags
        const tagsArray = [...keywords, 'coloring', 'art', 'creative'];
        const uniqueTags = Array.from(new Set(tagsArray)).slice(0, 5);
        
        // Insert into database
        const { error } = await supabase.from('blog_posts').insert({
          title,
          slug,
          content: bodyContent,
          meta_description: metaDescription || `Learn about ${topic} with our comprehensive guide.`,
          featured_image_url: featuredImageUrl,
          tags: uniqueTags,
          is_published: true,
        });
        
        if (error) {
          console.error('Error inserting blog post:', error);
          results.push({ topic, success: false, error: error.message });
        } else {
          successCount++;
          results.push({ topic, success: true });
          console.log(`Successfully created blog post: ${title}`);
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