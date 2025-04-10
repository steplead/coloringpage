'use client';

import { useEffect } from 'react';

// 直接替换页面上所有包含翻译键的文本
export default function FixTranslationsV2() {
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixTranslationsV2] 开始执行直接文本替换');

    // 常见翻译键及其对应的中文翻译
    const translations: Record<string, string> = {
      // 使用方法部分
      "title": "标题",  // 通用占位符
      "description": "描述",  // 通用占位符
      "home.howItWorks.title": "使用方法",
      "home.methods.describe.title": "描述您想要的图像",
      "home.methods.describe.description": "输入文字描述，我们的AI将创建匹配的涂色页",
      "home.methods.style.title": "选择您喜欢的风格",
      "home.methods.style.description": "从多种艺术风格中选择，定制您的涂色页外观",
      "home.methods.advanced.title": "高级设置",
      "home.methods.advanced.description": "调整细节参数，获得完全符合您需求的涂色页",
      
      // 用户评价部分
      "home.testimonials.title": "用户评价",
      "home.testimonials.1.text": "我的孩子们喜欢这些涂色页！每次我们都能创建新的独特图案。",
      "home.testimonials.1.author": "李明，两个孩子的父亲",
      "home.testimonials.2.text": "作为一名教师，这是我找到的最好的资源之一。我可以为我的学生创建主题涂色页。",
      "home.testimonials.2.author": "王老师，小学教师",
      "home.testimonials.3.text": "我用它来放松和减压。创建自己想象的场景然后给它上色非常有趣。",
      "home.testimonials.3.author": "张女士，艺术爱好者",
      "home.testimonials.cta": "立即开始创建",
      
      // 其他翻译键...可以根据需要添加更多
    };

    // 简单直接的文本替换方法
    const replaceTranslationKeys = () => {
      try {
        console.log('[Debug] 开始扫描并替换页面文本');
        
        // 获取页面上所有元素
        const allElements = document.querySelectorAll('*');
        let replacedCount = 0;
        
        // 处理"使用方法"部分
        const howItWorksSection = document.getElementById('how-it-works');
        if (howItWorksSection) {
          // 查找h2标题
          const sectionTitle = howItWorksSection.querySelector('h2');
          if (sectionTitle) {
            sectionTitle.textContent = '使用方法';
            console.log('[替换] 更新使用方法标题');
          }
        }
        
        // 遍历所有元素
        allElements.forEach(element => {
          // 只处理包含文本的元素
          if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = element.textContent?.trim();
            if (!text) return;
            
            // 直接替换文本内容
            if (text === 'title') {
              element.textContent = '描述您想要的图像';
              console.log('[替换] 找到title占位符');
              replacedCount++;
            } else if (text === 'description') {
              element.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
              console.log('[替换] 找到description占位符');
              replacedCount++;
            } else if (text === '"home.testimonials.1.text"') {
              element.textContent = `"${translations['home.testimonials.1.text']}"`;
              console.log('[替换] 找到用户评价1');
              replacedCount++;
            } else if (text === '"home.testimonials.2.text"') {
              element.textContent = `"${translations['home.testimonials.2.text']}"`;
              console.log('[替换] 找到用户评价2');
              replacedCount++;
            } else if (text === '"home.testimonials.3.text"') {
              element.textContent = `"${translations['home.testimonials.3.text']}"`;
              console.log('[替换] 找到用户评价3');
              replacedCount++;
            } else if (text === '- home.testimonials.1.author') {
              element.textContent = `- ${translations['home.testimonials.1.author']}`;
              console.log('[替换] 找到用户评价作者1');
              replacedCount++;
            } else if (text === '- home.testimonials.2.author') {
              element.textContent = `- ${translations['home.testimonials.2.author']}`;
              console.log('[替换] 找到用户评价作者2');
              replacedCount++;
            } else if (text === '- home.testimonials.3.author') {
              element.textContent = `- ${translations['home.testimonials.3.author']}`;
              console.log('[替换] 找到用户评价作者3');
              replacedCount++;
            }
          }
        });
        
        console.log(`[FixTranslationsV2] 完成替换，共替换了 ${replacedCount} 处文本`);

        // 特殊处理使用方法卡片
        const methodCards = document.querySelectorAll('section h3');
        methodCards.forEach((card, index) => {
          if (card.textContent === 'title') {
            if (index === 0) {
              card.textContent = '描述您想要的图像';
            } else if (index === 1) {
              card.textContent = '选择您喜欢的风格';
            } else if (index === 2) {
              card.textContent = '高级设置';
            }
          }
          
          // 找到相应的描述段落
          const nextP = card.nextElementSibling;
          if (nextP && nextP.tagName === 'P' && nextP.textContent === 'description') {
            if (index === 0) {
              nextP.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
            } else if (index === 1) {
              nextP.textContent = '从多种艺术风格中选择，定制您的涂色页外观';
            } else if (index === 2) {
              nextP.textContent = '调整细节参数，获得完全符合您需求的涂色页';
            }
          }
        });
      } catch (error) {
        console.error('[FixTranslationsV2] 替换文本时出错:', error);
      }
    };
    
    // 立即尝试替换
    replaceTranslationKeys();
    
    // 设置多个尝试以确保替换成功
    const intervals = [
      setTimeout(replaceTranslationKeys, 500),
      setTimeout(replaceTranslationKeys, 1000), 
      setTimeout(replaceTranslationKeys, 2000),
      setTimeout(replaceTranslationKeys, 3500)
    ];

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(mutation => 
        mutation.type === 'childList' || 
        (mutation.type === 'attributes' && mutation.attributeName === 'class')
      );
      
      if (shouldUpdate) {
        console.log('[FixTranslationsV2] 检测到DOM更新，尝试替换');
        replaceTranslationKeys();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // 添加一个全局函数，可以从控制台手动触发
    window._fixTranslations = replaceTranslationKeys;
    console.log('已添加全局函数 window._fixTranslations()，可以在控制台手动触发');
    
    return () => {
      intervals.forEach(clearTimeout);
      observer.disconnect();
      delete window._fixTranslations;
    };
  }, []);
  
  return null;
}

// 为TypeScript声明全局函数
declare global {
  interface Window {
    _fixTranslations?: () => void;
  }
} 