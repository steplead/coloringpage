# 儿童着色页面生成器

这是一个使用Next.js和Fal.ai API构建的儿童着色页面生成应用。该应用可以根据文本描述生成适合儿童着色的黑白线稿图像。

## 特性

- 使用文本描述生成儿童着色页面
- 自定义提示词（prompt）
- 可下载生成的图像
- 使用Fal.ai的`fal-ai/flux/schnell`模型

## 快速开始

### 前提条件

- Node.js 14.x 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆此仓库或下载代码

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 配置API密钥
   在`pages/api/generate-image.js`文件中，将API密钥替换为您自己的Fal.ai API密钥：
   ```javascript
   fal.config({
     credentials: "YOUR_FAL_API_KEY_HERE", // 替换为您的API密钥
   });
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. 在文本框中输入您想要生成的图像描述，如"一只可爱的猫咪，线条简单，黑白线稿，适合儿童着色"
2. 点击"生成着色页面"按钮
3. 等待图像生成（这可能需要几秒钟）
4. 生成完成后，您可以查看和下载图像

## 定制选项

您可以在前端代码中修改以下参数来定制生成的图像：

- `imageSize`: 图像尺寸（如"landscape_4_3", "square_hd"等）
- `numInferenceSteps`: 推理步骤数（默认为4）

## 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [Fal.ai API](https://fal.ai/) - AI图像生成服务
- [React](https://reactjs.org/) - 用户界面库

## 许可证

MIT

## 鸣谢

- [Fal.ai](https://fal.ai/)提供的强大API
- [Next.js](https://nextjs.org/)团队 