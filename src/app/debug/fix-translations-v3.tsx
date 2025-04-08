'use client';

import { useEffect, useRef } from 'react';

// V3增强版 - 通过定时器和setTimeout钩子来保持翻译内容持续显示
export default function FixTranslationsV3() {
  const fixCountRef = useRef(0);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixTranslationsV3] 启动持续性翻译修复');

    // 翻译字典
    const translations: Record<string, string> = {
      "title": "描述您想要的图像",
      "description": "输入文字描述，我们的AI将创建匹配的涂色页",
      "home.howItWorks.title": "使用方法",
      "home.methods.describe.title": "描述您想要的图像",
      "home.methods.describe.description": "输入文字描述，我们的AI将创建匹配的涂色页",
      "home.methods.style.title": "选择您喜欢的风格",
      "home.methods.style.description": "从多种艺术风格中选择，定制您的涂色页外观",
      "home.methods.advanced.title": "高级设置",
      "home.methods.advanced.description": "调整细节参数，获得完全符合您需求的涂色页",
      "home.testimonials.title": "用户评价",
      "home.testimonials.1.text": "我的孩子们喜欢这些涂色页！每次我们都能创建新的独特图案。",
      "home.testimonials.1.author": "李明，两个孩子的父亲",
      "home.testimonials.2.text": "作为一名教师，这是我找到的最好的资源之一。我可以为我的学生创建主题涂色页。",
      "home.testimonials.2.author": "王老师，小学教师",
      "home.testimonials.3.text": "我用它来放松和减压。创建自己想象的场景然后给它上色非常有趣。",
      "home.testimonials.3.author": "张女士，艺术爱好者",
      "home.testimonials.cta": "立即开始创建"
    };
    
    // 主要修复函数
    const performFix = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      
      console.log(`[FixTranslationsV3 #${fixId}] 开始扫描修复`);
      let fixedCount = 0;
      
      // 1. 修复标题
      document.querySelectorAll('h2').forEach(h2 => {
        const text = h2.textContent?.trim();
        if (text === 'Create Coloring Pages Your Way' || 
            text === 'How It Works' || 
            text === 'home.howItWorks.title') {
          h2.textContent = '使用方法';
          fixedCount++;
        }
      });
      
      // 2. 修复卡片标题
      const titleEls = Array.from(document.querySelectorAll('h3'))
        .filter(h3 => h3.textContent?.trim() === 'title');
        
      titleEls.forEach((h3, idx) => {
        if (idx === 0) {
          h3.textContent = translations['home.methods.describe.title'];
        } else if (idx === 1) {
          h3.textContent = translations['home.methods.style.title'];
        } else if (idx === 2) {
          h3.textContent = translations['home.methods.advanced.title'];
        } else {
          h3.textContent = translations['title'];
        }
        fixedCount++;
      });
      
      // 3. 修复卡片描述
      const descEls = Array.from(document.querySelectorAll('p'))
        .filter(p => p.textContent?.trim() === 'description');
        
      descEls.forEach((p, idx) => {
        if (idx === 0) {
          p.textContent = translations['home.methods.describe.description'];
        } else if (idx === 1) {
          p.textContent = translations['home.methods.style.description'];
        } else if (idx === 2) {
          p.textContent = translations['home.methods.advanced.description'];
        } else {
          p.textContent = translations['description'];
        }
        fixedCount++;
      });
      
      // 4. 修复评价
      document.querySelectorAll('p').forEach(p => {
        const text = p.textContent?.trim();
        if (text === '"home.testimonials.1.text"') {
          p.textContent = `"${translations['home.testimonials.1.text']}"`;
          fixedCount++;
        } else if (text === '"home.testimonials.2.text"') {
          p.textContent = `"${translations['home.testimonials.2.text']}"`;
          fixedCount++;
        } else if (text === '"home.testimonials.3.text"') {
          p.textContent = `"${translations['home.testimonials.3.text']}"`;
          fixedCount++;
        } else if (text === '- home.testimonials.1.author') {
          p.textContent = `- ${translations['home.testimonials.1.author']}`;
          fixedCount++;
        } else if (text === '- home.testimonials.2.author') {
          p.textContent = `- ${translations['home.testimonials.2.author']}`;
          fixedCount++;
        } else if (text === '- home.testimonials.3.author') {
          p.textContent = `- ${translations['home.testimonials.3.author']}`;
          fixedCount++;
        }
      });
      
      if (fixedCount > 0) {
        console.log(`[FixTranslationsV3 #${fixId}] 修复了 ${fixedCount} 处翻译`);
      }
    };
    
    // 首次运行修复
    performFix();
    
    // 定时运行修复，确保翻译内容持续显示
    timerId.current = setInterval(performFix, 1000);
    
    // 拦截setTimeout，确保其他组件的异步操作后也能保持翻译正确
    try {
      const originalSetTimeout = window.setTimeout;
      
      // 创建一个新的setTimeout函数，保留原始功能并添加额外的翻译修复
      const newSetTimeout = function(callback: TimerHandler, delay?: number, ...args: any[]): number {
        if (typeof callback === 'function') {
          const wrappedCallback = function(this: any) {
            // 执行原始回调
            callback.apply(this, args);
            // 在回调执行后，再次运行修复
            if (window.location.pathname.includes('/zh')) {
              setTimeout(performFix, 100);
            }
          };
          return originalSetTimeout(wrappedCallback as TimerHandler, delay);
        } else {
          return originalSetTimeout(callback, delay);
        }
      };
      
      // 添加__promisify__属性，修复TypeScript类型错误
      Object.defineProperty(newSetTimeout, '__promisify__', {
        value: originalSetTimeout.__promisify__,
        enumerable: false,
        writable: true,
        configurable: true
      });
      
      // 替换原始setTimeout
      window.setTimeout = newSetTimeout as typeof window.setTimeout;
      
      console.log('[FixTranslationsV3] 已拦截setTimeout函数，确保异步操作后保持翻译');
    } catch (error) {
      console.error('[FixTranslationsV3] 拦截setTimeout失败:', error);
    }
    
    // 添加全局方法
    window._fixTranslations = performFix;
    console.log('[FixTranslationsV3] 已添加全局修复函数 window._fixTranslations()');
    
    // 清理
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
      
      // 恢复原始setTimeout
      if (window.setTimeout !== setTimeout) {
        window.setTimeout = setTimeout;
      }
      
      delete window._fixTranslations;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslations?: () => void;
  }
} 