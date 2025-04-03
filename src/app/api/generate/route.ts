import { NextRequest, NextResponse } from 'next/server';
import { storeImageFromUrl } from '@/lib/storage';

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
      
      // 返回Supabase存储的URL，而不是原始的阿里云URL
      return NextResponse.json({
        success: true,
        imageUrl: storedImageUrl,
        originalUrl: imageUrl // 保留原始URL用于调试
      });
    } catch (storageError) {
      console.error('Error storing image in Supabase:', storageError);
      // 如果存储失败，回退到使用原始URL
      console.log('Falling back to original SiliconFlow URL');
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
        storageError: 'Failed to store in Supabase, using original URL'
      });
    }

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 