import { NextRequest, NextResponse } from 'next/server';
import { getRelatedImages } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching related images for ID: ${id}`);
    const images = await getRelatedImages(id);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching related images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related images' },
      { status: 500 }
    );
  }
} 