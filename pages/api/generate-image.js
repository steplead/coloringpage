import { fal } from "@fal-ai/client";
import axios from 'axios';

// 简单的中英文翻译词典
const translations = {
  "男孩": "boy",
  "女孩": "girl",
  "猫": "cat",
  "猫咪": "cat",
  "小猫": "kitten",
  "狗": "dog",
  "小狗": "puppy",
  "老虎": "tiger",
  "狮子": "lion",
  "大象": "elephant",
  "长颈鹿": "giraffe",
  "熊猫": "panda",
  "兔子": "rabbit",
  "鱼": "fish",
  "鸟": "bird",
  "蝴蝶": "butterfly",
  "恐龙": "dinosaur",
  "消防车": "fire truck",
  "汽车": "car",
  "火车": "train",
  "飞机": "airplane",
  "船": "boat",
  "花": "flower",
  "树": "tree",
  "房子": "house",
  "城堡": "castle",
  "月亮": "moon",
  "太阳": "sun",
  "星星": "star",
  "云": "cloud",
  "雨": "rain",
  "雪": "snow"
};

// 使用翻译API进行翻译
async function translateToEnglish(text) {
  // 如果已经是英文，直接返回
  if (/^[a-zA-Z0-9\s.,!?;:'"-]+$/.test(text)) {
    return text;
  }
  
  try {
    // 调用翻译API（如果在同一服务器上运行）
    const response = await axios.post('/api/translate', { text });
    
    // 如果API调用成功，使用返回的翻译结果
    if (response.data && response.data.success && response.data.translated) {
      console.log(`API翻译："${text}"翻译为"${response.data.translated}"`);
      return response.data.translated;
    }
    
    // 如果API调用失败，回退到原来的简单翻译逻辑
    // ... 保留原有的翻译逻辑作为备用 ...
    
    // 首先尝试使用本地词典快速匹配
    if (translations[text]) {
      console.log(`本地词典匹配："${text}"翻译为"${translations[text]}"`);
      return translations[text];
    }
    
    // 检查是否有多个词并尝试从词典中翻译各部分
    const words = text.split(/\s+/);
    if (words.length > 1) {
      const allInDictionary = words.every(word => translations[word]);
      if (allInDictionary) {
        const translatedWords = words.map(word => translations[word]);
        const result = translatedWords.join(' ');
        console.log(`本地词典组合："${text}"翻译为"${result}"`);
        return result;
      }
    }
    
    // 如果本地词典无法完全翻译，使用更简单的方法
    console.log(`无法完全翻译"${text}"，尝试部分翻译`);
    
    // 使用简单规则翻译
    const chineseChars = Array.from(text);
    let translated = "";
    let i = 0;
    
    while (i < chineseChars.length) {
      // 尝试匹配2字词
      if (i < chineseChars.length - 1) {
        const twoChars = chineseChars[i] + chineseChars[i+1];
        if (translations[twoChars]) {
          translated += translations[twoChars] + " ";
          i += 2;
          continue;
        }
      }
      
      // 尝试匹配单字
      if (translations[chineseChars[i]]) {
        translated += translations[chineseChars[i]] + " ";
      } else {
        // 无法翻译的字符保持原样
        translated += chineseChars[i];
      }
      i++;
    }
    
    const trimmedResult = translated.trim();
    console.log(`简单规则翻译："${text}"翻译为"${trimmedResult}"`);
    return trimmedResult || text;
    
  } catch (error) {
    console.error("翻译出错:", error);
    
    // 出错时回退到最简单的字典查找
    if (translations[text]) {
      return translations[text];
    }
    
    return text; // 出错时返回原文
  }
}

// 配置FAL API客户端（仅在服务器端使用）
fal.config({
  credentials: "0a7070de-07ad-405a-a383-8109d87a0bff:c4221528656e275ca4ed71ea622183c4", // 您的API密钥，删除了前缀"apikey:"
});

export default async function handler(req, res) {
  // 仅处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST方法' });
  }

  try {
    // 从请求体获取参数，或使用默认值
    let { 
      prompt = "一只可爱的猫咪", 
      imageSize = "landscape_4_3",
      numInferenceSteps = 4
    } = req.body;

    // 提取用户的内容描述，但强制使用着色页样式
    // 这里我们保留用户的内容描述，但添加着色页样式的指令
    const userContent = prompt.trim();
    
    // 翻译提示词
    const translatedContent = await translateToEnglish(userContent);
    
    // 构建新的提示词，强制使用着色页风格
    prompt = `Simple black and white line drawing of ${translatedContent}, thick clear outlines, coloring book style for children, no shading, no colors, minimalist, clean lines, cartoon style, suitable for children to color in, monochrome outline only`;

    console.log("发送请求到FAL API，参数：", { originalPrompt: userContent, translatedPrompt: translatedContent, finalPrompt: prompt, imageSize, numInferenceSteps });

    // 调用Fal.ai API生成图像
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
        image_size: imageSize,
        num_inference_steps: numInferenceSteps,
        num_images: 1,
        enable_safety_checker: true,
        // 添加负面提示词，确保不生成彩色图像
        negative_prompt: "color, shading, realistic, detailed, complex, watercolor, 3d, rendered, photograph, photorealistic, gradient, grayscale"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("生成中...", update);
        }
      },
    });

    // 打印完整响应以检查结构
    console.log("FAL API响应:", JSON.stringify(result, null, 2));

    // 在新版本的API中，图像URL可能位于不同的位置
    let imageUrl;
    
    // 尝试不同可能的结构
    if (result.images && result.images[0] && result.images[0].url) {
      // 旧版本格式
      imageUrl = result.images[0].url;
    } else if (result.image && result.image.url) {
      // 可能的新格式
      imageUrl = result.image.url;
    } else if (result.data && result.data.images && result.data.images[0] && result.data.images[0].url) {
      // 另一个可能的新格式
      imageUrl = result.data.images[0].url;
    } else {
      console.error("无法从响应中获取图像URL:", result);
      throw new Error("API响应中找不到图像URL");
    }

    // 返回生成的图像信息
    return res.status(200).json({ 
      success: true, 
      imageUrl: imageUrl,
      prompt: userContent, // 返回用户原始输入，而不是修改后的提示词
      translated: translatedContent, // 返回翻译后的内容
      fullResponse: result // 返回完整响应以便调试
    });
  } catch (error) {
    console.error("生成图像时出错:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "调用API时发生错误" 
    });
  }
} 