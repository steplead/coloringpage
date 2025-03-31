import { NextRequest, NextResponse } from 'next/server';
import { 
  getOptimalSeedRange, 
  getOptimizedParams, 
  getCategoryNegativePrompts,
  enhancePrompt,
  recursivePromptOptimization,
  optimizeImage,
  assessImageQuality
} from '@/lib/imageProcessing';
import { 
  CategoryType, 
  ComplexityType, 
  StyleType, 
  GenerationRequest, 
  GenerationResponse 
} from '@/types/image';

// SiliconFlow API configuration
const API_KEY = process.env.SILICONFLOW_API_KEY || 'sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah';
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// 基础提示词模板
const BASE_PROMPT = `Create a clean black outline coloring page with the following characteristics:
- Only simple black lines on white background
- No shading, grayscale, or color
- Clear distinct lines suitable for coloring
- Clean and minimalist design
- No text or labels
- Perfect for printing and coloring with crayons or markers
Subject: `;

export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json() as GenerationRequest;
    const { description, complexity, style, category = 'default' } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' } as GenerationResponse,
        { status: 400 }
      );
    }

    // 构建基础提示词
    let basePrompt = `${BASE_PROMPT}${description}`;

    // 根据复杂度调整提示词
    const complexityModifiers = {
      simple: 'with very simple shapes and minimal details, perfect for young children, ',
      detailed: 'with intricate details and more complex elements, ',
      medium: 'with moderate level of detail, '
    };
    basePrompt += complexityModifiers[complexity as ComplexityType] || complexityModifiers.medium;

    // 根据风格调整提示词
    const styleModifiers = {
      cartoon: 'in a fun cartoon style, ',
      realistic: 'with realistic proportions but still as a line drawing, ',
      abstract: 'in an abstract artistic style, ',
      geometric: 'using geometric shapes and patterns, ',
      standard: ''
    };
    basePrompt += styleModifiers[style as StyleType] || styleModifiers.standard;

    // 使用提示词增强引擎优化提示词
    const enhancedPrompt = enhancePrompt(basePrompt, category as CategoryType);
    
    // 获取类别特定的负面提示词
    const negativePrompt = getCategoryNegativePrompts(category as CategoryType);

    // 获取最优种子范围
    const [minSeed, maxSeed] = getOptimalSeedRange(category as CategoryType);
    const seed = Math.floor(Math.random() * (maxSeed - minSeed)) + minSeed;

    // 获取优化的生成参数
    const optimizedParams = getOptimizedParams(complexity);

    console.log('Generating image with prompt:', enhancedPrompt);
    console.log('Negative prompt:', negativePrompt);

    // 准备API请求参数
    const payload = {
      model: MODEL,
      prompt: enhancedPrompt,
      negative_prompt: negativePrompt,
      seed,
      ...optimizedParams
    };

    // 调用SiliconFlow API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to generate image from API', 
          details: errorData 
        } as GenerationResponse,
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 获取生成的图像数据
    const imageResponse = await fetch(data.data[0].url);
    const imageBlob = await imageResponse.blob();

    // 优化生成的图像
    const optimizedImageBlob = await optimizeImage(imageBlob);

    // 评估图像质量
    const qualityScore = await assessImageQuality(optimizedImageBlob);

    // 如果质量分数低于阈值，尝试使用递归提示优化重新生成
    if (qualityScore < 7.0) {
      const optimizedPrompt = recursivePromptOptimization(enhancedPrompt, [data.data[0].url]);
      // 这里可以添加重新生成的逻辑
    }

    // 返回生成结果
    return NextResponse.json({
      success: true,
      prompt: enhancedPrompt,
      imageUrl: data.data[0].url,
      message: 'Image generated successfully',
      qualityScore
    } as GenerationResponse);

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error instanceof Error ? error.message : String(error) 
      } as GenerationResponse,
      { status: 500 }
    );
  }
} 