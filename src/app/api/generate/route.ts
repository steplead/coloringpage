import { NextRequest, NextResponse } from 'next/server';
import { storeImageFromUrl } from '@/lib/storage';
import { saveImageToGallery } from '@/lib/supabase';

// SiliconFlow API configuration from environment variables
const API_KEY = process.env.SILICONFLOW_API_KEY;
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// Basic coloring page style prompt
const BASE_PROMPT = 'black outline coloring page, clean lines';

export async function POST(request: NextRequest) {
  try {
    // Verify API key is available
    if (!API_KEY) {
      console.error('Missing API key in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request data
    const body = await request.json();
    const { description, style, isAdvancedMode, customPrompt } = body;

    if (!description && !isAdvancedMode) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (isAdvancedMode && !customPrompt) {
      return NextResponse.json(
        { error: 'Custom prompt is required in advanced mode' },
        { status: 400 }
      );
    }

    // Determine the final prompt based on mode
    let finalPrompt;
    if (isAdvancedMode) {
      finalPrompt = customPrompt;
    } else {
      // Combine user description, selected style and base prompt
      finalPrompt = style 
        ? `${description}, ${style}, ${BASE_PROMPT}`
        : `${description}, ${BASE_PROMPT}`;
    }
    
    console.log('Generating image with prompt:', finalPrompt);

    // Create API request data - exactly matching our successful curl command
    const requestData = {
      model: MODEL,
      prompt: finalPrompt,
      num_inference_steps: 30,
      guidance_scale: 7.5
    };

    // Call SiliconFlow API - keeping it as simple as possible
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error status:', response.status);
      console.error('API error response:', errorText);
      
      return NextResponse.json(
        { error: `Failed to generate image from API (Status: ${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for image URL in the response
    let imageUrl = null;
    if (data.images && data.images.length > 0 && data.images[0].url) {
      imageUrl = data.images[0].url;
    } else if (data.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'API response missing image URL' },
        { status: 500 }
      );
    }

    try {
      // 存储图片到Supabase Storage
      console.log('Storing image from SiliconFlow to Supabase Storage');
      const prompt = isAdvancedMode ? customPrompt : description;
      const storedImageUrl = await storeImageFromUrl(imageUrl, prompt);
      
      console.log('Image successfully stored in Supabase:', storedImageUrl);
      
      // 自动保存到Gallery
      console.log('Automatically saving to gallery...');
      const title = prompt.substring(0, 100); // 使用前100个字符作为标题
      const galleryResult = await saveImageToGallery(prompt, storedImageUrl, style, title);
      console.log('Save to gallery result:', galleryResult ? 'Success' : 'Failed');
      
      // Check if saving to gallery failed
      if (!galleryResult) {
        console.error('Failed to save image metadata to gallery database after successful storage.');
        // Return an error even though the image was stored, as the gallery save failed.
        return NextResponse.json({
          success: false,
          error: 'Image generated and stored, but failed to save to gallery database.',
          imageUrl: storedImageUrl, // Provide URL for potential client-side fallback/display
          savedToGallery: false
        }, { status: 500 }); // Internal Server Error
      }
      
      // 返回Supabase存储的URL，而不是原始的阿里云URL
      return NextResponse.json({
        success: true,
        imageUrl: storedImageUrl,
        originalUrl: imageUrl, // 保留原始URL用于调试
        savedToGallery: !!galleryResult
      });
    } catch (storageError) {
      console.error('Error storing image in Supabase Storage:', storageError);
      // DO NOT save to gallery if storage failed.
      // Return an error response to the client.
      return NextResponse.json({
        success: false,
        error: 'Image generated but failed to save to gallery.',
        details: storageError instanceof Error ? storageError.message : 'Unknown storage error',
        imageUrl: imageUrl, // Still provide the original URL for potential display/debugging by the client if needed
        savedToGallery: false
      }, { status: 500 }); // Indicate server error during storage processing
    }

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 