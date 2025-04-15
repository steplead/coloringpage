import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateImageMetadata } from '@/lib/seo';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl, style, title } = await request.json();
    
    if (!prompt || !imageUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt and image URL are required' 
      }, { status: 400 });
    }
    
    // Generate SEO-optimized metadata for the image
    const seoMetadata = generateImageMetadata(prompt, style);
    
    // Get current date/time
    const now = new Date().toISOString();
    
    // Insert into database with SEO metadata
    const { data, error } = await supabase
      .from('images')
      .insert({
        prompt,
        image_url: imageUrl,
        style: style || 'standard',
        title: title || seoMetadata.title,
        alt_text: seoMetadata.alt,
        seo_description: seoMetadata.description,
        seo_filename: seoMetadata.filename,
        caption: seoMetadata.caption,
        keywords: seoMetadata.keywords,
        created_at: now,
        updated_at: now
      })
      .select();
    
    if (error) {
      console.error('Error saving to gallery:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image saved to gallery',
      data: data[0]
    });
  } catch (error: unknown) {
    console.error('Error in save-to-gallery:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 });
  }
} 