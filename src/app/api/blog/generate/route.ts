import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, getPopularKeywords } from '@/lib/blog/generator';
import { BlogPostTemplateProps } from '@/lib/blog/postTemplate';

/**
 * API endpoint for generating SEO-optimized blog posts
 * This can be called from the admin interface to create new content
 */
export async function POST(request: NextRequest) {
  try {
    // Admin authentication should be implemented here
    // For this example, we'll assume the request is already authenticated
    
    const body = await request.json();
    const { topic, keyword, save = false } = body;
    
    // Validate required parameters
    if (!topic || !keyword) {
      return NextResponse.json(
        { error: 'Missing required parameters: topic and keyword are required' },
        { status: 400 }
      );
    }
    
    // Generate the blog post with our SEO template
    const blogPost: BlogPostTemplateProps = await generateBlogPost(topic, keyword);
    
    // In a real implementation, you would save to database if save=true
    if (save) {
      // await savePostToDatabase(blogPost);
      console.log(`Post would be saved: ${blogPost.title}`);
    }
    
    return NextResponse.json({
      success: true,
      post: blogPost
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

/**
 * Get popular keywords for blog post generation
 */
export async function GET() {
  try {
    const keywords = getPopularKeywords();
    
    // Generate some blog post ideas based on SEO research
    const ideas = [
      'Mindfulness Coloring Pages: Reduce Stress and Boost Creativity for All Ages',
      'Educational Coloring Pages: How to Make Learning Fun through Art',
      'Animal Coloring Pages: Combining Art and Biology Education for Kids',
      'Mandala Coloring for Beginners: Simple Techniques for Beautiful Results',
      'Seasonal Coloring Pages: Celebrating Nature Through the Year'
    ];
    
    return NextResponse.json({
      success: true,
      keywords,
      ideas
    });
  } catch (error) {
    console.error('Error getting blog keywords:', error);
    return NextResponse.json(
      { error: 'Failed to get blog keywords' },
      { status: 500 }
    );
  }
} 