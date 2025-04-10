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
        document.querySelectorAll('h3').forEach((h3, index) => {
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
      window.setTimeout = function(callback, delay, ...args) {
        if (typeof callback === 'function') {
          const wrappedCallback = function() {
            // 执行原始回调
            const result = callback.apply(this, args);
            // 在任何setTimeout回调执行后尝试修复翻译
            setTimeout(fixTranslations, 100);
            return result;
          };
          return originalSetTimeout(wrappedCallback, delay);
        }
        return originalSetTimeout(callback, delay, ...args);
      };
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