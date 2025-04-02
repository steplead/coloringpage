import { NextResponse } from 'next/server';
import { saveImageToGallery } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    console.log('API: Save to gallery request received');
    
    const body = await request.json();
    console.log('API: Request body:', JSON.stringify(body));
    
    const { prompt, imageUrl, style, title } = body;

    if (!prompt || !imageUrl) {
      console.error('API: Missing required fields', { prompt: !!prompt, imageUrl: !!imageUrl });
      return NextResponse.json(
        { error: 'Missing required fields: prompt and imageUrl are required' },
        { status: 400 }
      );
    }

    console.log('API: Calling saveImageToGallery with:', { 
      promptLength: prompt.length,
      imageUrlLength: imageUrl.length,
      style,
      titleLength: title?.length
    });

    const result = await saveImageToGallery(prompt, imageUrl, style, title);

    if (!result) {
      console.error('API: Failed to save image to gallery - null result returned');
      return NextResponse.json(
        { error: 'Failed to save image to gallery' },
        { status: 500 }
      );
    }

    console.log('API: Successfully saved image to gallery');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in save-to-gallery API:', error);
    if (error instanceof Error) {
      console.error('Error details:', { 
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 