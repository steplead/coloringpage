import { NextRequest, NextResponse } from 'next/server';
import { getImageById } from '@/lib/supabase';

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

    console.log(`Fetching image details for ID: ${id}`);
    const image = await getImageById(id);

    if (!image) {
      console.log(`Image not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error fetching image details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image details' },
      { status: 500 }
    );
  }
} 