import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';

/**
 * Test endpoint for blog post generation
 * This endpoint tests the blog post generation with our improved content cleaning
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request data
    const { topic = 'animal coloring page' } = await request.json().catch(() => ({}));
    
    console.log('Testing blog post generation with topic:', topic);
    
    // Generate a test blog post
    const result = await generateBlogPost(topic);
    
    // Check if the content contains any of the forbidden patterns
    const forbiddenPatterns = [
      'Welcome to our guide',
      'Welcome to our website',
      'Welcome to our collection',
      'Welcome to AI Coloring Page',
      'About coloring pages',
      'About our site',
      'I\'ve been using these coloring pages',
      'testimonial',
      'coloring pages feature distinctive patterns',
      'coloring pages are specialized designs',
      'offer unique benefits for artists',
      'designed with careful attention to detail'
    ];
    
    const foundPatterns = forbiddenPatterns.filter(pattern => 
      result.content.includes(pattern)
    );
    
    // Generate response with test results
    return NextResponse.json({
      success: true,
      hasProhibitedContent: foundPatterns.length > 0,
      prohibitedContentFound: foundPatterns,
      title: result.title,
      description: result.description,
      contentLength: result.content.length,
      wordCount: result.content.split(/\s+/).length,
      content: result.content
    });
  } catch (error: unknown) {
    console.error('Error testing blog post generation:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 