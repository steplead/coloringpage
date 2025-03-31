// 图像生成相关类型定义

// 图像类别类型
export type CategoryType = 'animals' | 'nature' | 'fantasy' | 'vehicles' | 'patterns' | 'default';

// 复杂度类型
export type ComplexityType = 'simple' | 'medium' | 'detailed';

// 风格类型
export type StyleType = 'standard' | 'cartoon' | 'realistic' | 'abstract' | 'geometric';

// 图像生成参数类型
export interface GenerationParams {
  num_inference_steps: number;
  guidance_scale: number;
}

// 图像生成请求类型
export interface GenerationRequest {
  description: string;
  complexity: ComplexityType;
  style: StyleType;
  category?: CategoryType;
}

// 图像生成响应类型
export interface GenerationResponse {
  success: boolean;
  prompt?: string;
  imageUrl?: string;
  message?: string;
  error?: string;
  details?: string;
}

// 图像质量评估结果类型
export interface QualityAssessment {
  score: number;
  feedback: string[];
} 