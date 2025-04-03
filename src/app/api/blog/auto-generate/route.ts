import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';
import { BlogPost } from '../route';

// Topics related to coloring pages for auto-generation
const COLORING_TOPICS = [
  'animal',
  'dinosaur',
  'princess',
  'superhero',
  'space',
  'ocean',
  'holiday',
  'seasons',
  'educational',
  'fantasy',
  'vehicles',
  'nature',
  'sports',
  'flowers',
  'architecture',
  'cartoon characters',
  'mandala',
  'geometric patterns'
];

/**
 * POST handler for automatic blog post generation
 * Generates multiple blog posts based on predefined topics
 */
export async function POST(request: NextRequest) {
  try {
    // Optional authorization check
    const authHeader = request.headers.get('authorization');
    // In a production environment, you might want to check a secret token
    // if (authHeader !== `Bearer ${process.env.AUTO_GENERATE_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Parse request parameters (or use defaults)
    const requestData = await request.json().catch(() => ({}));
    const {
      count = 3,
      targetLength = 1000,
    } = requestData;

    console.log(`Auto-generating ${count} blog posts...`);

    // Select random topics from our predefined list
    const selectedTopics = getRandomTopics(Math.min(count, 5));
    const results: { topic: string; success: boolean; slug?: string }[] = [];

    // Generate blog posts for each selected topic
    for (const topic of selectedTopics) {
      try {
        console.log(`Generating blog post for topic: ${topic}`);

        // Find a related image from the gallery for this topic
        const { data: images } = await supabase
          .from('images')
          .select('*')
          .ilike('prompt', `%${topic}%`)
          .order('created_at', { ascending: false })
          .limit(1);

        const relatedImageId = images && images.length > 0 ? images[0].id : null;
        const featuredImageUrl = images && images.length > 0 ? images[0].image_url : null;

        // Generate blog content with Gemini
        const { title, content, description } = await generateBlogPost(topic, targetLength);

        // Create tags
        const tags = generateTags(topic, title);

        // Create slug from title
        const slug = createSlug(title);

        // Create blog post object
        const blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
          slug,
          title,
          content,
          meta_description: description,
          featured_image_url: featuredImageUrl,
          related_coloring_page_id: relatedImageId,
          tags,
          is_published: true
        };

        // Save to Supabase
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([blogPost])
          .select('id, slug');

        if (error) {
          console.error(`Failed to save blog post for topic ${topic}:`, error);
          results.push({ topic, success: false });
          continue;
        }

        results.push({ 
          topic, 
          success: true, 
          slug: data[0].slug
        });

        console.log(`Successfully generated blog post for topic: ${topic}, slug: ${data[0].slug}`);
      } catch (error) {
        console.error(`Error generating blog post for topic ${topic}:`, error);
        results.push({ topic, success: false });
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error('Error in auto-generate blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to auto-generate blog posts' },
      { status: 500 }
    );
  }
}

/**
 * Get a random set of topics from the predefined list
 */
function getRandomTopics(count: number): string[] {
  const shuffled = [...COLORING_TOPICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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