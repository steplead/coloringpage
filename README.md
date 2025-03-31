# Coloringpage

AI-powered coloring page generator

## 项目配置

### 环境变量

项目使用以下环境变量：

```env
# SiliconFlow API Configuration
SILICONFLOW_API_KEY=your_api_key
SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/images/generations
SILICONFLOW_MODEL=black-forest-labs/FLUX.1-schnell

# Image Generation Configuration
DEFAULT_IMAGE_SIZE=1024
MAX_RETRY_ATTEMPTS=3
MIN_QUALITY_SCORE=7.0

# Cache Configuration
CACHE_DURATION=3600
MAX_CACHE_SIZE=100
```

### Vercel 配置

项目使用 `vercel.json` 进行部署配置：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 部署步骤

1. **准备工作**
   - 确保所有代码已提交到 GitHub
   - 创建并配置 `.env.local` 文件
   - 确保 API 密钥和 URL 配置正确

2. **Vercel 部署**
   - 在 Vercel 中导入 GitHub 仓库
   - 配置环境变量
   - 选择部署区域（推荐选择离用户较近的区域）
   - 等待自动部署完成

3. **部署后配置**
   - 配置自定义域名（如需要）
   - 设置安全头部（已在 vercel.json 中配置）
   - 启用自动部署（默认启用）

4. **监控和维护**
   - 监控 API 调用和使用情况
   - 定期检查性能指标
   - 根据需要调整缓存配置

## 技术栈

- Next.js 14.2.26
- TypeScript
- SiliconFlow API
- Vercel 托管

## 开发指南

1. **本地开发**
   ```bash
   npm install
   npm run dev
   ```

2. **构建**
   ```bash
   npm run build
   ```

3. **生产环境运行**
   ```bash
   npm start
   ```

## 注意事项

- 确保 `.env.local` 文件不被提交到版本控制
- 定期更新依赖包以修复安全问题
- 遵循 TypeScript 类型定义以确保代码质量
