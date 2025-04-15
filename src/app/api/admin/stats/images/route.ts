import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get count of images
    const { count, error } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching image count:', error);
      return NextResponse.json({ error: 'Failed to fetch image count' }, { status: 500 });
    }
    
    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in image stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 