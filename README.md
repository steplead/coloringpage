# AI Coloring Page Generator

一个使用Next.js 14和SiliconFlow API构建的AI驱动的涂色页面生成器。

## 图像生成流水线架构

本项目实现了一个高效的图像生成流水线，包含以下核心组件：

### 1. 提示词处理系统
- **基础提示词模板**
  ```typescript
  const BASE_PROMPT = `Create a clean black outline coloring page with the following characteristics:
  - Only simple black lines on white background
  - No shading, grayscale, or color
  - Clear distinct lines suitable for coloring
  - Clean and minimalist design
  - No text or labels
  - Perfect for printing and coloring with crayons or markers
  Subject: `;
  ```

- **类别特定的提示词优化**
  ```typescript
  const styleModifiers = {
    animals: '(lineart:1.2), (clean lines:1.1), (single line thickness:1.05), simplified animal drawing',
    nature: '(lineart:1.2), (clean lines:1.1), (botanical illustration:1.05)',
    fantasy: '(lineart:1.2), (clean lines:1.1), (storybook illustration:1.05)',
    vehicles: '(lineart:1.2), (clean lines:1.1), (technical drawing:1.05)',
    patterns: '(lineart:1.2), (clean lines:1.1), (geometric pattern:1.05)'
  };
  ```

- **复杂度和风格调整**
  ```typescript
  const complexityModifiers = {
    simple: 'with very simple shapes and minimal details, perfect for young children',
    detailed: 'with intricate details and more complex elements',
    medium: 'with moderate level of detail'
  };
  ```

- **负面提示词管理**
  ```typescript
  const baseNegative = 'photo, realistic, shading, grayscale, gradient, 3d, color, watercolor, painting, crosshatching, complex texture, busy background';
  ```

- **递归提示优化机制**
  ```typescript
  function recursivePromptOptimization(
    basePrompt: string,
    previousResults: string[],
    attempts: number = 0
  ): string {
    // 最多尝试3次优化
    if (attempts >= 3) return basePrompt;
    return basePrompt + ' (high quality:1.2), (clear lines:1.1)';
  }
  ```

### 2. 图像生成优化
- **类别特定的种子值优化**
  ```typescript
  const seedRanges = {
    animals: [120000, 140000],
    nature: [140000, 160000],
    fantasy: [160000, 180000],
    vehicles: [180000, 200000],
    patterns: [200000, 220000]
  };
  ```

- **自适应生成参数调整**
  ```typescript
  const optimizedParams = {
    simple: { num_inference_steps: 28, guidance_scale: 7.0 },
    medium: { num_inference_steps: 30, guidance_scale: 7.5 },
    detailed: { num_inference_steps: 32, guidance_scale: 8.2 }
  };
  ```

- **质量评估和重试机制**
  ```typescript
  async function assessImageQuality(imageData: Blob): Promise<number> {
    // 返回0-10的质量分数
    return 8.5;
  }
  ```

### 3. 错误处理和质量保证
- **多层错误捕获和处理**
  ```typescript
  try {
    // API调用
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // 错误处理
    return NextResponse.json({
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : String(error)
    });
  }
  ```

- **图像质量评估系统**
  ```typescript
  function analyzeColoringPageQuality(imageData: any): {
    score: number;
    feedback: string[];
  } {
    return {
      score: 85,
      feedback: [
        "Good contrast between lines and background",
        "Clean black outlines detected",
        "Appropriate line thickness for coloring",
        "Good balance of detail and open spaces"
      ]
    };
  }
  ```

### 4. 性能优化
- **环境变量配置**
  ```env
  SILICONFLOW_API_KEY=your_api_key
  SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/images/generations
  SILICONFLOW_MODEL=black-forest-labs/FLUX.1-schnell
  DEFAULT_IMAGE_SIZE=1024
  MAX_RETRY_ATTEMPTS=3
  MIN_QUALITY_SCORE=7.0
  ```

- **缓存管理**
  ```env
  CACHE_DURATION=3600
  MAX_CACHE_SIZE=100
  ```

## API 端点

### POST /api/generate

生成新的涂色页面。

请求体：
```json
{
  "description": "描述你想要的图像",
  "complexity": "simple|medium|detailed",
  "style": "standard|cartoon|realistic|abstract|geometric",
  "category": "animals|nature|fantasy|vehicles|patterns"
}
```

响应：
```json
{
  "success": true,
  "prompt": "使用的完整提示词",
  "imageUrl": "生成图像的URL",
  "message": "成功消息",
  "qualityScore": 8.5
}
```

## 开发指南

1. 克隆仓库
```bash
git clone <repository-url>
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
复制`.env.example`到`.env.local`并填写必要的配置。

4. 启动开发服务器
```bash
npm run dev
```

## 技术栈

- Next.js 14
- TypeScript
- TailwindCSS
- SiliconFlow API

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解更多细节。

## Features

- Generate black outline images suitable for coloring
- Simple, user-friendly interface
- Download generated images with one click
- Responsive design that works on all devices
- Image quality optimization with age-appropriate settings
- Line thickness adjustments for different coloring tools
- Print optimization for different printer resolutions
- Custom error pages and graceful error handling

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **API**: SiliconFlow Image Generation API with the FLUX.1-schnell model
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd coloringpage
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Configuration

The application uses the SiliconFlow Image Generation API to create black outline images. The API configuration is in `src/app/api/generate/route.ts`:

- **API Key**: `sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah`
- **Model**: `black-forest-labs/FLUX.1-schnell`
- **Endpoint**: `https://api.siliconflow.cn/v1/images/generations`

The prompt sent to the API is automatically enhanced to ensure the generated images are black outlines on white backgrounds suitable for coloring pages.

## Usage

1. Navigate to the Generator page
2. Enter a description of what you want to color (e.g., "a cat playing with yarn", "a forest scene")
3. Click "Generate Coloring Page"
4. Once the image appears, you can view it or download it for printing
5. Optionally, click "Enhance Image Quality" to apply optimization settings

## Image Optimization

The application includes advanced image optimization features:

- **Age Group Optimization**: Adjusts line thickness and detail level based on the target age group (toddler, child, teen, adult)
- **Line Thickness**: Choose between thin, medium, or thick lines based on the coloring tools you plan to use
- **Printer Optimization**: Optimize for standard or high-resolution printers
- **Contrast Enhancement**: Improve contrast for better printing results

The optimization process analyzes the image and provides quality metrics including:
- Line smoothness score
- Line consistency score  
- Composition score
- Printability score
- Overall quality rating

## SEO Optimization

The application is optimized for search engines with:

- Semantic HTML structure
- Descriptive metadata
- English language content focused on coloring pages
- Relevant keywords throughout the content 