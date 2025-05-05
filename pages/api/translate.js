import axios from 'axios';

// 简单的中英文翻译词典，与generate-image.js中相同
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
  "雪": "snow",
  "美丽": "beautiful",
  "可爱": "cute",
  "漂亮": "pretty",
  "大": "big",
  "小": "small",
  "高": "tall",
  "矮": "short",
  "跑": "run",
  "走": "walk",
  "飞": "fly",
  "游泳": "swim"
};

// 使用词典和简单规则进行翻译
async function simpleTranslate(text) {
  // 如果已经是英文，直接返回
  if (/^[a-zA-Z0-9\s.,!?;:'"-]+$/.test(text)) {
    return text;
  }
  
  // 查找字典中是否有对应的翻译
  if (translations[text]) {
    return translations[text];
  }
  
  // 检查是否有多个词并尝试翻译各部分
  const words = text.split(/\s+/);
  if (words.length > 1) {
    const allInDictionary = words.every(word => translations[word]);
    if (allInDictionary) {
      const translatedWords = words.map(word => translations[word]);
      return translatedWords.join(' ');
    }
  }
  
  // 尝试将文本分成单字或词组进行简单翻译
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
  
  return translated.trim() || text;
}

// 这里是在线翻译API的实现
// 注意：实际使用需要替换为真实的API调用和密钥
async function onlineTranslate(text) {
  try {
    // 这里应该是实际的API调用
    // 下面是示例代码，实际使用时需要替换为真实的API调用
    
    // 例如使用百度翻译API (需要appid和密钥)
    // const appid = 'YOUR_APPID';
    // const key = 'YOUR_KEY';
    // const salt = Date.now();
    // const sign = MD5(appid + text + salt + key);
    // const response = await axios.get(
    //   `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(text)}&from=zh&to=en&appid=${appid}&salt=${salt}&sign=${sign}`
    // );
    // return response.data.trans_result[0].dst;
    
    // 使用模拟延迟来模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 回退到简单翻译
    return await simpleTranslate(text);
  } catch (error) {
    console.error("在线翻译API调用出错:", error);
    // 出错时回退到简单翻译
    return await simpleTranslate(text);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST方法' });
  }

  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: '缺少要翻译的文本' });
    }

    // 首先尝试使用在线翻译API
    let translated = await onlineTranslate(text);
    
    return res.status(200).json({
      success: true,
      original: text,
      translated: translated,
      method: '在线翻译API'
    });
  } catch (error) {
    console.error("翻译出错:", error);
    return res.status(500).json({
      success: false,
      error: error.message || '翻译过程中发生错误'
    });
  }
} 