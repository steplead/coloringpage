'use client';

import { useEffect, useRef } from 'react';

// V4增强版 - 专注于解决异步加载覆盖问题和React状态更新触发的重渲染
export default function FixTranslationsV4() {
  const fixCountRef = useRef(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const originalFetchRef = useRef<typeof window.fetch | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV4] 启动增强版翻译修复 - 专注解决异步加载和React重渲染问题');

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

    // 记录已修复的元素，避免重复修复
    const fixedElements = new WeakMap<Element, boolean>();
    
    // 主要修复函数
    const performFix = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      
      console.log(`[FixV4 #${fixId}] 开始扫描修复`);
      let fixedCount = 0;
      
      // 1. 修复标题
      document.querySelectorAll('h2').forEach(h2 => {
        if (fixedElements.has(h2)) return;
        
        const text = h2.textContent?.trim();
        if (text === 'Create Coloring Pages Your Way' || 
            text === 'How It Works' || 
            text === 'home.howItWorks.title') {
          h2.textContent = '使用方法';
          fixedElements.set(h2, true);
          fixedCount++;
        }
      });
      
      // 2. 修复卡片标题
      const titleEls = Array.from(document.querySelectorAll('h3'))
        .filter(h3 => h3.textContent?.trim() === 'title');
        
      titleEls.forEach((h3, idx) => {
        if (fixedElements.has(h3)) return;
        
        if (idx === 0) {
          h3.textContent = translations['home.methods.describe.title'];
        } else if (idx === 1) {
          h3.textContent = translations['home.methods.style.title'];
        } else if (idx === 2) {
          h3.textContent = translations['home.methods.advanced.title'];
        } else {
          h3.textContent = translations['title'];
        }
        
        fixedElements.set(h3, true);
        fixedCount++;
      });
      
      // 3. 修复卡片描述
      const descEls = Array.from(document.querySelectorAll('p'))
        .filter(p => p.textContent?.trim() === 'description');
        
      descEls.forEach((p, idx) => {
        if (fixedElements.has(p)) return;
        
        if (idx === 0) {
          p.textContent = translations['home.methods.describe.description'];
        } else if (idx === 1) {
          p.textContent = translations['home.methods.style.description'];
        } else if (idx === 2) {
          p.textContent = translations['home.methods.advanced.description'];
        } else {
          p.textContent = translations['description'];
        }
        
        fixedElements.set(p, true);
        fixedCount++;
      });
      
      // 4. 修复评价
      document.querySelectorAll('p').forEach(p => {
        if (fixedElements.has(p)) return;
        
        const text = p.textContent?.trim();
        if (text === '"home.testimonials.1.text"') {
          p.textContent = `"${translations['home.testimonials.1.text']}"`;
          fixedElements.set(p, true);
          fixedCount++;
        } else if (text === '"home.testimonials.2.text"') {
          p.textContent = `"${translations['home.testimonials.2.text']}"`;
          fixedElements.set(p, true);
          fixedCount++;
        } else if (text === '"home.testimonials.3.text"') {
          p.textContent = `"${translations['home.testimonials.3.text']}"`;
          fixedElements.set(p, true);
          fixedCount++;
        } else if (text === '- home.testimonials.1.author') {
          p.textContent = `- ${translations['home.testimonials.1.author']}`;
          fixedElements.set(p, true);
          fixedCount++;
        } else if (text === '- home.testimonials.2.author') {
          p.textContent = `- ${translations['home.testimonials.2.author']}`;
          fixedElements.set(p, true);
          fixedCount++;
        } else if (text === '- home.testimonials.3.author') {
          p.textContent = `- ${translations['home.testimonials.3.author']}`;
          fixedElements.set(p, true);
          fixedCount++;
        }
      });
      
      if (fixedCount > 0) {
        console.log(`[FixV4 #${fixId}] 修复了 ${fixedCount} 处翻译`);
      }
    };
    
    // 设置MutationObserver监控DOM变化
    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new MutationObserver(() => {
        // 使用requestAnimationFrame批量处理
        window.requestAnimationFrame(() => {
          performFix();
        });
      });
      
      // 监控整个文档
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
      });
      
      console.log('[FixV4] MutationObserver已设置，正在监控DOM变化');
    };
    
    // 1. 拦截翻译API - 解决异步加载覆盖问题
    const interceptTranslationAPI = () => {
      if (originalFetchRef.current === null) {
        originalFetchRef.current = window.fetch;
      }
      
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' 
          ? input 
          : input instanceof Request ? input.url : '';
          
        if (url.includes('/api/i18n') && url.includes('zh')) {
          console.log('[FixV4] 拦截到翻译API请求:', url);
          
          try {
            // 先获取原始响应
            const response = await originalFetchRef.current!(input, init);
            const clone = response.clone();
            
            // 获取响应内容
            const translations = await clone.json();
            console.log('[FixV4] 原始翻译数据:', translations);
            
            // 创建增强版的响应
            // 这里我们可以修改translations对象，但保持响应格式一致
            
            // 设置定时器在翻译应用后修复DOM
            setTimeout(performFix, 0);
            setTimeout(performFix, 100);
            setTimeout(performFix, 500);
            setTimeout(performFix, 1000);
            
            return response;
          } catch (error) {
            console.error('[FixV4] 拦截翻译API时出错:', error);
            return originalFetchRef.current!(input, init);
          }
        }
        
        return originalFetchRef.current!(input, init);
      };
      
      console.log('[FixV4] 已拦截fetch API，监控翻译请求');
    };
    
    // 2. 拦截React状态更新 - 解决React重渲染问题
    const interceptReactStateUpdates = () => {
      // 拦截setTimeout，确保我们的修复函数在React批量更新后执行
      const originalSetTimeout = window.setTimeout;
      
      // 修复TypeScript错误，正确声明setTimeout
      const newSetTimeout = function(
        handler: TimerHandler, 
        timeout?: number | undefined, 
        ...args: any[]
      ) {
        // 获取调用栈以检测是否来自React
        const stack = new Error().stack || '';
        const isReactStateUpdate = stack.includes('react') || 
                                  stack.includes('ReactDOM') || 
                                  (typeof handler === 'function' && 
                                   handler.toString().includes('setState'));
        
        if (isReactStateUpdate && timeout && timeout < 50) {
          console.log('[FixV4] 检测到可能的React状态更新');
          
          // 包装原始处理程序
          const wrappedHandler = function(this: any) {
            // 先执行原始处理程序
            if (typeof handler === 'function') {
              handler.apply(this, args);
            } else if (typeof handler === 'string') {
              eval(handler);
            }
            
            // 在处理程序执行后修复DOM
            originalSetTimeout(performFix, 0);
          };
          
          return originalSetTimeout(wrappedHandler, timeout);
        }
        
        return originalSetTimeout(handler, timeout, ...args);
      };
      
      // 添加__promisify__属性
      Object.defineProperty(newSetTimeout, '__promisify__', {
        value: originalSetTimeout.__promisify__,
        enumerable: false,
        writable: true,
        configurable: true
      });
      
      // 替换原始setTimeout
      window.setTimeout = newSetTimeout as typeof originalSetTimeout;
      
      console.log('[FixV4] 已拦截setTimeout，监控React状态更新');
    };
    
    // 执行初始修复
    performFix();
    
    // 设置观察器
    setupObserver();
    
    // 拦截翻译API - 最可能的原因1
    interceptTranslationAPI();
    
    // 拦截React状态更新 - 最可能的原因2
    interceptReactStateUpdates();
    
    // 设置定时执行 - 不管怎样每隔一段时间都强制检查
    const interval1 = setInterval(performFix, 300);   // 每0.3秒
    const interval2 = setInterval(performFix, 3000);  // 每3秒强制刷新
    
    // 页面加载完成后再次修复
    if (document.readyState !== 'complete') {
      window.addEventListener('load', performFix, { once: true });
    }
    
    // 添加全局方法
    window._fixTranslationsV4 = performFix;
    console.log('[FixV4] 已添加全局修复函数 window._fixTranslationsV4()');
    
    // 清理
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearInterval(interval1);
      clearInterval(interval2);
      window.removeEventListener('load', performFix);
      
      // 恢复原始fetch
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
      
      // 恢复原始setTimeout
      if (window.setTimeout !== setTimeout) {
        window.setTimeout = setTimeout;
      }
      
      delete window._fixTranslationsV4;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslationsV4?: () => void;
  }
} 