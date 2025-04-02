import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for scheduled blog post generation
 * This endpoint is designed to be called by a cron job service like Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Check for secret token authorization
    // This helps ensure that only authorized services can trigger the generation
    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.CRON_SECRET_KEY;
    
    // If a secret key is configured, validate it
    if (secretKey && authHeader !== `Bearer ${secretKey}`) {
      console.error('Unauthorized cron job attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Scheduled blog post generation triggered');
    
    // Call the auto-generate endpoint
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${siteUrl}/api/blog/auto-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        count: 2, // Generate 2 blog posts per week
        targetLength: 1200, // Slightly longer posts for better SEO
      }),
    });
    
    const data = await response.json();
    
    // Log the results
    if (data.success) {
      console.log(`Successfully generated ${data.generated} blog posts`);
      
      if (data.failed > 0) {
        console.warn(`Failed to generate ${data.failed} blog posts`);
      }
    } else {
      console.error('Blog generation failed:', data.error);
    }
    
    return NextResponse.json({
      success: data.success,
      message: `Generated ${data.generated || 0} blog posts, failed ${data.failed || 0}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in scheduled blog generation:', error);
    return NextResponse.json(
      { error: 'Failed to run scheduled blog generation' },
      { status: 500 }
    );
  }
} 