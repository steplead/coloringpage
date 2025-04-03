import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') || undefined;
    const style = searchParams.get('style') || undefined;
    
    console.log(`Fetching gallery images: page=${page}, limit=${limit}, category=${category}, style=${style}`);
    
    const images = await getGalleryImages({ page, limit, category, style });
    
    return NextResponse.json({ 
      images,
      page,
      limit,
      category,
      style
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
} 