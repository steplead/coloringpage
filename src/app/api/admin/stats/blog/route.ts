import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get count of blog posts
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching blog post count:', error);
      return NextResponse.json({ error: 'Failed to fetch blog post count' }, { status: 500 });
    }
    
    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in blog stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 