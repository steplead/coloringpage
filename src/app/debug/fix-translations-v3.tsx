'use client';

import { useEffect, useRef } from 'react';

// 硬编码的中文翻译
const translations: Record<string, string> = {
  'title': '标题',
  'description': '描述',
  'home.methods.describe.title': '描述您想要的图像',
  'home.methods.describe.description': '输入文字描述，我们的AI将创建匹配的涂色页',
  'home.methods.style.title': '选择您喜欢的风格',
  'home.methods.style.description': '从多种艺术风格中选择，定制您的涂色页外观',
  'home.methods.advanced.title': '高级设置',
  'home.methods.advanced.description': '调整细节参数，获得完全符合您需求的涂色页',
  'home.testimonials.1.text': '我的孩子们喜欢用这些涂色页！每次都能得到新的设计，非常棒。',
  'home.testimonials.1.author': '张妈妈，两个孩子的母亲',
  'home.testimonials.2.text': '作为一名教师，这个工具帮我为课堂活动创建了完美的涂色材料。',
  'home.testimonials.2.author': '李老师，小学教师',
  'home.testimonials.3.text': '界面简单易用，生成的涂色页质量很高，线条清晰流畅。',
  'home.testimonials.3.author': '王先生，涂色爱好者'
};

export default function FixTranslationsV3() {
  // 使用refs跟踪定时器和执行次数
  const intervalIdRef = useRef<number | null>(null);
  const fixCountRef = useRef<number>(0);
  
  useEffect(() => {
    console.log('[FixTranslationsV3] 脚本开始执行');

    // 如果不是中文页面，则不执行修复
    if (!window.location.pathname.includes('/zh')) {
      console.log('[FixTranslationsV3] 非中文页面，不执行修复');
      return;
    }
    
    // 简单直接的文本替换方法
    const fixTranslations = () => {
      try {
        fixCountRef.current += 1;
        const fixCount = fixCountRef.current;
        console.log(`[V3修复 #${fixCount}] 扫描和替换页面文本`);
        
        let replacedCount = 0;
        
        // 修复"使用方法"部分标题
        document.querySelectorAll('h2').forEach(h2 => {
          const text = h2.textContent?.trim();
          if (text === 'Create Coloring Pages Your Way' || 
              text === 'How It Works' || 
              text === 'home.howItWorks.title') {
            h2.textContent = '使用方法';
            replacedCount++;
          }
        });

        // 修复卡片标题和描述
        document.querySelectorAll('h3').forEach((h3) => {
          const text = h3.textContent?.trim();
          if (text === 'title') {
            // 找到第几个title，根据顺序选择对应翻译
            const cardIndex = Array.from(document.querySelectorAll('h3')).filter(el => 
              el.textContent?.trim() === 'title'
            ).indexOf(h3);
            
            // 根据索引设置不同的翻译
            if (cardIndex === 0) {
              h3.textContent = translations['home.methods.describe.title'];
            } else if (cardIndex === 1) {
              h3.textContent = translations['home.methods.style.title'];
            } else if (cardIndex === 2) {
              h3.textContent = translations['home.methods.advanced.title'];
            } else {
              h3.textContent = translations['title'];
            }
            replacedCount++;
          }
        });
        
        document.querySelectorAll('p').forEach(p => {
          const text = p.textContent?.trim();
          if (text === 'description') {
            // 查找这是第几个description
            const descIndex = Array.from(document.querySelectorAll('p')).filter(el => 
              el.textContent?.trim() === 'description'
            ).indexOf(p);
            
            // 根据索引设置不同的翻译
            if (descIndex === 0) {
              p.textContent = translations['home.methods.describe.description'];
            } else if (descIndex === 1) {
              p.textContent = translations['home.methods.style.description'];
            } else if (descIndex === 2) {
              p.textContent = translations['home.methods.advanced.description'];
            } else {
              p.textContent = translations['description'];
            }
            replacedCount++;
          } else if (text === '"home.testimonials.1.text"') {
            p.textContent = `"${translations['home.testimonials.1.text']}"`;
            replacedCount++;
          } else if (text === '"home.testimonials.2.text"') {
            p.textContent = `"${translations['home.testimonials.2.text']}"`;
            replacedCount++;
          } else if (text === '"home.testimonials.3.text"') {
            p.textContent = `"${translations['home.testimonials.3.text']}"`;
            replacedCount++;
          }
        });
        
        // 修复评价作者
        document.querySelectorAll('p').forEach(p => {
          const text = p.textContent?.trim();
          if (text === '- home.testimonials.1.author') {
            p.textContent = `- ${translations['home.testimonials.1.author']}`;
            replacedCount++;
          } else if (text === '- home.testimonials.2.author') {
            p.textContent = `- ${translations['home.testimonials.2.author']}`;
            replacedCount++;
          } else if (text === '- home.testimonials.3.author') {
            p.textContent = `- ${translations['home.testimonials.3.author']}`;
            replacedCount++;
          }
        });
        
        // 输出修复结果
        if (replacedCount > 0) {
          console.log(`[V3修复 #${fixCount}] 找到并替换了 ${replacedCount} 处翻译`);
        } else {
          console.log(`[V3修复 #${fixCount}] 未找到需要替换的内容`);
        }
      } catch (error) {
        console.error('[FixTranslationsV3] 修复过程中出错:', error);
      }
    };
    
    // 初始化修复
    // 1. 立即执行一次
    fixTranslations();
    
    // 2. 在DOM加载完成后执行
    if (document.readyState !== 'complete') {
      window.addEventListener('load', fixTranslations, { once: true });
    }
    
    // 3. 延时执行几次，防止其他组件延迟加载
    const immediateTimers = [
      setTimeout(fixTranslations, 500),
      setTimeout(fixTranslations, 1500),
      setTimeout(fixTranslations, 3000)
    ];
    
    // 4. 每隔一秒持续检查修复 - 关键步骤
    intervalIdRef.current = window.setInterval(fixTranslations, 1000);
    
    // 5. 劫持React的renderSubtreeIntoContainer等方法的执行
    try {
      const originalSetTimeout = window.setTimeout;
      window.setTimeout = function(
        callback: TimerHandler, 
        delay?: number, 
        ...args: unknown[]
      ): number {
        if (typeof callback === 'function') {
          const wrappedCallback = function(this: unknown): void {
            // 执行原始回调
            const result = callback.apply(this, args);
            // 在任何setTimeout回调执行后尝试修复翻译
            setTimeout(fixTranslations, 100);
            return result;
          };
          return originalSetTimeout(wrappedCallback as TimerHandler, delay);
        }
        return originalSetTimeout(callback, delay, ...args);
      } as typeof window.setTimeout;
      console.log('[FixTranslationsV3] 成功劫持setTimeout方法');
    } catch (e) {
      console.error('[FixTranslationsV3] 无法劫持setTimeout方法:', e);
    }
    
    // 添加全局修复函数
    window._fixTranslationsV3 = fixTranslations;
    console.log('[FixTranslationsV3] 已添加全局修复函数 window._fixTranslationsV3()');
    
    // 清理函数
    return () => {
      immediateTimers.forEach(clearTimeout);
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
      window.removeEventListener('load', fixTranslations);
      delete window._fixTranslationsV3;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslationsV3?: () => void;
  }
} 