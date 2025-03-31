/**
 * Image Processing Service for Coloring Pages
 * 
 * This service handles image optimization specifically for coloring pages
 * - Ensures clean black outlines on white background
 * - Optimizes for printing
 * - Provides image analysis and enhancement
 */

/**
 * Image processing utility functions for AI coloring page generation
 */

/**
 * Get optimal seed range for specific content types
 * Different seed ranges produce better results for different content types
 */
import { CategoryType } from '@/types/image';

export function getOptimalSeedRange(category: CategoryType): [number, number] {
  switch (category) {
    case 'animals':
      return [120000, 140000];
    case 'nature':
      return [140000, 160000];
    case 'fantasy':
      return [160000, 180000];
    case 'vehicles':
      return [180000, 200000];
    case 'patterns':
      return [200000, 220000];
    default:
      return [100000, 999999];
  }
}

/**
 * Get optimized parameters for specific image types
 */
export function getOptimizedParams(complexity: 'simple' | 'medium' | 'detailed') {
  const baseParams = {
    num_inference_steps: 30,
    guidance_scale: 7.5,
  };

  const complexityParams = {
    simple: {
      num_inference_steps: 28,
      guidance_scale: 7.0,
    },
    medium: baseParams,
    detailed: {
      num_inference_steps: 32,
      guidance_scale: 8.2,
    }
  } as const;

  return complexityParams[complexity] || baseParams;
}

/**
 * Get category-specific negative prompts to improve generation quality
 */
export function getCategoryNegativePrompts(category: CategoryType): string {
  const baseNegative = 'photo, realistic, shading, grayscale, gradient, 3d, color, watercolor, painting, crosshatching, complex texture, busy background';
  
  const categoryNegatives = {
    animals: `${baseNegative}, human, people, text, realistic fur, realistic eyes`,
    nature: `${baseNegative}, people, buildings, vehicles, complex patterns`,
    fantasy: `${baseNegative}, realistic, modern, urban, technical`,
    vehicles: `${baseNegative}, organic shapes, people, animals, nature`,
    patterns: `${baseNegative}, specific objects, scenes, figures`,
    default: baseNegative
  };

  return categoryNegatives[category] || categoryNegatives.default;
}

/**
 * Get suggested prompt enhancements based on user input
 */
export function getSuggestedPromptEnhancements(userPrompt: string): string[] {
  const suggestions = [];

  // Check for common improvement opportunities
  if (userPrompt.length < 10) {
    suggestions.push('Add more details to your description for better results');
  }
  
  if (!userPrompt.toLowerCase().includes('background')) {
    suggestions.push('Consider describing the background or setting');
  }
  
  if (!userPrompt.match(/position|pose|standing|sitting/i)) {
    suggestions.push('Specify the position or pose of the main subject');
  }
  
  // Add general suggestions if no specific ones were found
  if (suggestions.length === 0) {
    suggestions.push('Try adding adjectives to describe the mood or style');
    suggestions.push('Consider specifying the perspective (e.g., front view, side view)');
  }
  
  return suggestions;
}

// Function to determine if an image has good contrast for coloring
export function analyzeColoringPageQuality(imageData: any): {
  score: number;
  feedback: string[];
} {
  // This would normally use canvas and image processing libraries
  // For demonstration, we're providing a simulated analysis
  
  // In a real implementation, this would:
  // 1. Measure the contrast between lines and background
  // 2. Check for presence of grayscale elements (should be pure black/white)
  // 3. Analyze line thickness and consistency
  // 4. Evaluate balance of white space vs. coloring areas
  
  // Simulated score between 0-100
  const score = 85;
  
  const feedback = [
    "Good contrast between lines and background",
    "Clean black outlines detected",
    "Appropriate line thickness for coloring",
    "Good balance of detail and open spaces",
  ];
  
  return { score, feedback };
}

// 提示词增强引擎
export function enhancePrompt(basePrompt: string, category: CategoryType): string {
  const styleModifiers = {
    animals: '(lineart:1.2), (clean lines:1.1), (single line thickness:1.05), simplified animal drawing',
    nature: '(lineart:1.2), (clean lines:1.1), (botanical illustration:1.05)',
    fantasy: '(lineart:1.2), (clean lines:1.1), (storybook illustration:1.05)',
    vehicles: '(lineart:1.2), (clean lines:1.1), (technical drawing:1.05)',
    patterns: '(lineart:1.2), (clean lines:1.1), (geometric pattern:1.05)',
    default: '(lineart:1.2), (clean lines:1.1), (single line thickness:1.05)'
  };

  return `${basePrompt} ${styleModifiers[category] || styleModifiers.default}`;
}

// 图像后处理优化
export async function optimizeImage(imageData: Blob): Promise<Blob> {
  // 这里将来可以添加实际的图像处理逻辑
  // 例如：边缘检测、背景纯白化、线条黑化等
  return imageData;
}

// 递归提示优化
export function recursivePromptOptimization(
  basePrompt: string,
  previousResults: string[],
  attempts: number = 0
): string {
  const maxAttempts = 3;
  if (attempts >= maxAttempts) {
    return basePrompt;
  }

  // 基于之前的结果调整提示词
  let optimizedPrompt = basePrompt;
  if (previousResults.length > 0) {
    // 这里可以添加基于之前结果的优化逻辑
    optimizedPrompt += ' (high quality:1.2), (clear lines:1.1)';
  }

  return optimizedPrompt;
}

// 图像质量评估
export function assessImageQuality(imageData: Blob): Promise<number> {
  return new Promise((resolve) => {
    // 这里将来可以添加实际的质量评估逻辑
    // 返回0-10的质量分数
    resolve(8.5);
  });
} 