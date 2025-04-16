import { NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

/**
 * Test endpoint to generate a blog post with enhanced content cleaning
 * This helps verify our improvements to the content generation process
 */
export async function GET() {
  try {
    // Get a sample image to use for the test
    const { data: images } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images found for testing' }, { status: 404 });
    }
    
    const image = images[0];
    console.log('Using image for test generation:', image.id, image.title);
    
    // Extract topic from image
    const topic = image.title?.split(' ')[0] || 'animal';
    
    // Prepare image details object
    const imageDetails = {
      id: image.id,
      imageUrl: image.image_url,
      title: image.title || topic,
      description: image.seo_description || image.caption || `A ${topic} coloring page`,
      keywords: image.keywords || [topic, 'coloring page', 'printable'],
      prompt: image.prompt || topic,
    };
    
    console.log('Generating test blog post for:', topic);
    
    // Generate blog content with our improved function
    const blogContent = await generateBlogPost(
      topic,
      1500, // target length
      imageDetails
    );
    
    // Check if generation was skipped or failed
    if (!blogContent) {
      console.error('Test blog generation skipped or failed because generateBlogPost returned null.');
      return NextResponse.json(
        { error: 'Blog post generation was skipped (likely during build) or failed.' },
        { status: 503 } // Service Unavailable might be appropriate here
      );
    }
    
    // Now we know blogContent is not null, proceed with destructuring
    const { title, content, description } = blogContent;
    
    // Check for unwanted patterns in the content
    const unwantedPhrases = [
      'Welcome to',
      'testimonial',
      'About coloring pages',
      'feature distinctive patterns',
      'offer unique benefits',
      'I\'ve been using these coloring pages',
      'designed with careful attention',
    ];
    
    // Count occurrences of unwanted phrases
    const unwantedPhraseCount = unwantedPhrases.reduce((count, phrase) => {
      const regex = new RegExp(phrase, 'gi');
      const matches = content.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    return NextResponse.json({
      success: true,
      hasUnwantedPhrases: unwantedPhraseCount > 0,
      unwantedPhraseCount,
      title,
      description,
      content: content.substring(0, 1000) + '...' // Show beginning only for preview
    });
  } catch (error: unknown) {
    console.error('Error in test blog generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate test blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 