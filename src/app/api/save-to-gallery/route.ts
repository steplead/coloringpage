import { NextResponse } from 'next/server';
import { saveImageToGallery } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { prompt, imageUrl, style, title } = await request.json();

    if (!prompt || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and imageUrl are required' },
        { status: 400 }
      );
    }

    const result = await saveImageToGallery(prompt, imageUrl, style, title);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to save image to gallery' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in save-to-gallery API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 