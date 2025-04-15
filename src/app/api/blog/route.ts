import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';

// Define the blog post structure
export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  content: string;
  meta_description: string;
  featured_image_url?: string;
  related_coloring_page_id?: string;
  tags: string[];
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  translations?: Record<string, {
    title: string;
    content: string;
    description: string;
  }>;
  seo_data?: {
    keywords?: string[];
    primaryKeyword?: string;
    canonicalUrl?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    structuredData?: any; // Keep any for structure flexibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    faqSchema?: any[]; // Keep any for structure flexibility
  };
}

/**
 * POST handler for blog post generation
 * Generates a blog post using Gemini API based on the provided topic
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request data
    const { topic, relatedImageId, targetLength = 1000 } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('Generating blog post for topic:', topic);

    // Generate blog post content using Gemini API
    const { title, content, description } = await generateBlogPost(topic, targetLength);

    // Create tags from topic and title keywords
    const tags = generateTags(topic, title);

    // Create a slug from the title
    const slug = createSlug(title);

    // Optional: Get featured image if relatedImageId is provided
    let featuredImageUrl = '';
    if (relatedImageId) {
      const { data: image } = await supabase
        .from('images')
        .select('image_url')
        .eq('id', relatedImageId)
        .single();

      featuredImageUrl = image?.image_url || '';
    }

    // Create the blog post object
    const blogPost: BlogPost = {
      slug,
      title,
      content,
      meta_description: description,
      featured_image_url: featuredImageUrl,
      related_coloring_page_id: relatedImageId,
      tags,
      is_published: true
    };

    // Save to Supabase if database is set up
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([blogPost])
        .select('id, slug, created_at');

      if (error) {
        console.error('Error saving blog post to database:', error);
      } else {
        console.log('Blog post saved successfully:', data);
        // Return the saved blog post with its ID
        return NextResponse.json({
          success: true,
          blog_post: {
            ...blogPost,
            id: data[0]?.id,
            created_at: data[0]?.created_at
          }
        });
      }
    } catch (dbError) {
      console.error('Exception saving blog post to database:', dbError);
      // Continue even if database save fails, return the generated content
    }

    // If database save failed or not implemented, still return the generated content
    return NextResponse.json({
      success: true,
      blog_post: blogPost
    });

  } catch (error: unknown) {
    console.error('Error in blog post generation API:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to generate tags from topic and title
 */
function generateTags(topic: string, title: string): string[] {
  // Base tags for coloring pages
  const baseTags = ['coloring pages', 'printable', 'activities'];
  
  // Add topic as tag
  const tags = new Set<string>([...baseTags, topic.toLowerCase()]);
  
  // Extract potential keywords from title
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 3) // Only include words longer than 3 chars
    .filter(word => !baseTags.includes(word)) // Exclude words already in base tags
    .slice(0, 5); // Limit to 5 additional keywords
  
  // Add filtered title words to tags
  titleWords.forEach(word => tags.add(word));
  
  return Array.from(tags);
} 