'use client';

import { useEffect, useRef } from 'react';

// V5修复脚本 - 更强大的DOM直接修复版本
export default function FixTranslationsV5() {
  const fixCountRef = useRef(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV5] 启动最新版翻译修复');

    // 翻译字典 - 扩展更多内容
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
      "home.testimonials.cta": "立即开始创建",
      "Try it": "试一试",
      "Create Now": "立即创建",
      "Try Now": "试一试"
    };

    // 针对"使用方法"部分的特定修复
    const methodTranslations = [
      {
        icon: "✏️", // 铅笔图标的卡片
        title: "描述您想要的图像",
        description: "输入文字描述，我们的AI将创建匹配的涂色页"
      },
      {
        icon: "🎨", // 调色板图标的卡片
        title: "选择您喜欢的风格",
        description: "从多种艺术风格中选择，定制您的涂色页外观"
      },
      {
        icon: "⚙️", // 齿轮图标的卡片
        title: "高级设置",
        description: "调整细节参数，获得完全符合您需求的涂色页"
      }
    ];
    
    // 主要修复函数 - 强化版
    const performFix = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      
      console.log(`[FixV5 #${fixId}] 开始扫描修复`);
      let fixedCount = 0;

      try {
        // 1. 修复主标题"使用方法"
        document.querySelectorAll('h2').forEach(h2 => {
          if (h2.textContent?.trim() === 'How It Works' || 
              h2.textContent?.trim() === 'Create Coloring Pages Your Way' ||
              h2.textContent?.trim() === 'home.howItWorks.title' ||
              h2.textContent?.trim() === 'title') {
            h2.textContent = '使用方法';
            fixedCount++;
          }
        });
        
        // 2. 直接修复卡片组件 - 基于DOM结构
        const methodCards = document.querySelectorAll('.grid.gap-6, .grid.gap-8, .grid.gap-4');
        methodCards.forEach(grid => {
          // 查找包含卡片的网格
          if (grid.children.length >= 3) {
            // 假设这是方法卡片的容器
            Array.from(grid.children).forEach((card, index) => {
              if (index < 3) { // 只处理前三个卡片
                // 查找卡片内的h3（标题）和p（描述）
                const titleEl = card.querySelector('h3, h4');
                const descEl = card.querySelector('p');
                
                if (titleEl && (titleEl.textContent?.trim() === 'title' || 
                                titleEl.textContent?.includes('home.methods'))) {
                  titleEl.textContent = methodTranslations[index].title;
                  fixedCount++;
                }
                
                if (descEl && (descEl.textContent?.trim() === 'description' || 
                              descEl.textContent?.includes('home.methods'))) {
                  descEl.textContent = methodTranslations[index].description;
                  fixedCount++;
                }
                
                // 修复按钮文本
                const buttonEl = card.querySelector('button, a.button, a.btn, .btn, [role="button"]');
                if (buttonEl && buttonEl.textContent) {
                  const buttonText = buttonEl.textContent.trim();
                  if (buttonText === 'Try it' || buttonText === 'Try Now') {
                    buttonEl.textContent = '试一试';
                    fixedCount++;
                  } else if (buttonText === 'Create Now') {
                    buttonEl.textContent = '立即创建';
                    fixedCount++;
                  }
                }
              }
            });
          }
        });
        
        // 3. 修复用户评价部分
        document.querySelectorAll('blockquote, .testimonial').forEach((quote, index) => {
          const textEl = quote.querySelector('p');
          const authorEl = quote.querySelector('cite, .author, footer');
          
          if (textEl && textEl.textContent?.includes('home.testimonials')) {
            const testimonialIndex = index + 1;
            const key = `home.testimonials.${testimonialIndex}.text`;
            if (translations[key]) {
              textEl.textContent = `"${translations[key]}"`;
              fixedCount++;
            }
          }
          
          if (authorEl && authorEl.textContent?.includes('home.testimonials')) {
            const testimonialIndex = index + 1;
            const key = `home.testimonials.${testimonialIndex}.author`;
            if (translations[key]) {
              authorEl.textContent = `- ${translations[key]}`;
              fixedCount++;
            }
          }
        });
        
        // 4. 修复所有页面中的通用元素
        document.querySelectorAll('button, a.btn, .btn').forEach(btn => {
          const text = btn.textContent?.trim();
          if (text === 'Try it' || text === 'Try Now') {
            btn.textContent = '试一试';
            fixedCount++;
          } else if (text === 'Create Now' || text === 'Create') {
            btn.textContent = '立即创建';
            fixedCount++;
          }
        });
        
        // 5. 最直接的修复：所有匹配"title"文本的h3和"description"文本的p
        document.querySelectorAll('h3').forEach(h3 => {
          if (h3.textContent?.trim() === 'title') {
            h3.textContent = translations["home.methods.describe.title"]; // 默认使用第一个方法的标题
            fixedCount++;
          }
        });
        
        document.querySelectorAll('p').forEach(p => {
          if (p.textContent?.trim() === 'description') {
            p.textContent = translations["home.methods.describe.description"]; // 默认使用第一个方法的描述
            fixedCount++;
          }
        });
        
        if (fixedCount > 0) {
          console.log(`[FixV5 #${fixId}] 修复了 ${fixedCount} 处翻译`);
        } else {
          console.log(`[FixV5 #${fixId}] 没有发现需要修复的内容`);
        }
      } catch (error) {
        console.error(`[FixV5 #${fixId}] 修复过程中出错:`, error);
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
      
      console.log('[FixV5] MutationObserver已设置，正在监控DOM变化');
    };
    
    // 首次执行修复
    performFix();
    
    // 设置观察器
    setupObserver();
    
    // 设置定时执行 - 防止其他脚本覆盖我们的修复
    intervalIdRef.current = setInterval(() => {
      performFix();
    }, 1000);
    
    // 监听页面加载完成事件
    if (document.readyState !== 'complete') {
      window.addEventListener('load', performFix, { once: true });
    }
    
    // 添加全局修复方法
    window._fixTranslationsV5 = performFix;
    console.log('[FixV5] 已添加全局修复函数 window._fixTranslationsV5()');
    
    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      
      window.removeEventListener('load', performFix);
      delete window._fixTranslationsV5;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslationsV5?: () => void;
  }
} 

import { useEffect, useRef } from 'react';

// V5修复脚本 - 更强大的DOM直接修复版本
export default function FixTranslationsV5() {
  const fixCountRef = useRef(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV5] 启动最新版翻译修复');

    // 翻译字典 - 扩展更多内容
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
      "home.testimonials.cta": "立即开始创建",
      "Try it": "试一试",
      "Create Now": "立即创建",
      "Try Now": "试一试"
    };

    // 针对"使用方法"部分的特定修复
    const methodTranslations = [
      {
        icon: "✏️", // 铅笔图标的卡片
        title: "描述您想要的图像",
        description: "输入文字描述，我们的AI将创建匹配的涂色页"
      },
      {
        icon: "🎨", // 调色板图标的卡片
        title: "选择您喜欢的风格",
        description: "从多种艺术风格中选择，定制您的涂色页外观"
      },
      {
        icon: "⚙️", // 齿轮图标的卡片
        title: "高级设置",
        description: "调整细节参数，获得完全符合您需求的涂色页"
      }
    ];
    
    // 主要修复函数 - 强化版
    const performFix = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      
      console.log(`[FixV5 #${fixId}] 开始扫描修复`);
      let fixedCount = 0;

      try {
        // 1. 修复主标题"使用方法"
        document.querySelectorAll('h2').forEach(h2 => {
          if (h2.textContent?.trim() === 'How It Works' || 
              h2.textContent?.trim() === 'Create Coloring Pages Your Way' ||
              h2.textContent?.trim() === 'home.howItWorks.title' ||
              h2.textContent?.trim() === 'title') {
            h2.textContent = '使用方法';
            fixedCount++;
          }
        });
        
        // 2. 直接修复卡片组件 - 基于DOM结构
        const methodCards = document.querySelectorAll('.grid.gap-6, .grid.gap-8, .grid.gap-4');
        methodCards.forEach(grid => {
          // 查找包含卡片的网格
          if (grid.children.length >= 3) {
            // 假设这是方法卡片的容器
            Array.from(grid.children).forEach((card, index) => {
              if (index < 3) { // 只处理前三个卡片
                // 查找卡片内的h3（标题）和p（描述）
                const titleEl = card.querySelector('h3, h4');
                const descEl = card.querySelector('p');
                
                if (titleEl && (titleEl.textContent?.trim() === 'title' || 
                                titleEl.textContent?.includes('home.methods'))) {
                  titleEl.textContent = methodTranslations[index].title;
                  fixedCount++;
                }
                
                if (descEl && (descEl.textContent?.trim() === 'description' || 
                              descEl.textContent?.includes('home.methods'))) {
                  descEl.textContent = methodTranslations[index].description;
                  fixedCount++;
                }
                
                // 修复按钮文本
                const buttonEl = card.querySelector('button, a.button, a.btn, .btn, [role="button"]');
                if (buttonEl && buttonEl.textContent) {
                  const buttonText = buttonEl.textContent.trim();
                  if (buttonText === 'Try it' || buttonText === 'Try Now') {
                    buttonEl.textContent = '试一试';
                    fixedCount++;
                  } else if (buttonText === 'Create Now') {
                    buttonEl.textContent = '立即创建';
                    fixedCount++;
                  }
                }
              }
            });
          }
        });
        
        // 3. 修复用户评价部分
        document.querySelectorAll('blockquote, .testimonial').forEach((quote, index) => {
          const textEl = quote.querySelector('p');
          const authorEl = quote.querySelector('cite, .author, footer');
          
          if (textEl && textEl.textContent?.includes('home.testimonials')) {
            const testimonialIndex = index + 1;
            const key = `home.testimonials.${testimonialIndex}.text`;
            if (translations[key]) {
              textEl.textContent = `"${translations[key]}"`;
              fixedCount++;
            }
          }
          
          if (authorEl && authorEl.textContent?.includes('home.testimonials')) {
            const testimonialIndex = index + 1;
            const key = `home.testimonials.${testimonialIndex}.author`;
            if (translations[key]) {
              authorEl.textContent = `- ${translations[key]}`;
              fixedCount++;
            }
          }
        });
        
        // 4. 修复所有页面中的通用元素
        document.querySelectorAll('button, a.btn, .btn').forEach(btn => {
          const text = btn.textContent?.trim();
          if (text === 'Try it' || text === 'Try Now') {
            btn.textContent = '试一试';
            fixedCount++;
          } else if (text === 'Create Now' || text === 'Create') {
            btn.textContent = '立即创建';
            fixedCount++;
          }
        });
        
        // 5. 最直接的修复：所有匹配"title"文本的h3和"description"文本的p
        document.querySelectorAll('h3').forEach(h3 => {
          if (h3.textContent?.trim() === 'title') {
            h3.textContent = translations["home.methods.describe.title"]; // 默认使用第一个方法的标题
            fixedCount++;
          }
        });
        
        document.querySelectorAll('p').forEach(p => {
          if (p.textContent?.trim() === 'description') {
            p.textContent = translations["home.methods.describe.description"]; // 默认使用第一个方法的描述
            fixedCount++;
          }
        });
        
        if (fixedCount > 0) {
          console.log(`[FixV5 #${fixId}] 修复了 ${fixedCount} 处翻译`);
        } else {
          console.log(`[FixV5 #${fixId}] 没有发现需要修复的内容`);
        }
      } catch (error) {
        console.error(`[FixV5 #${fixId}] 修复过程中出错:`, error);
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
      
      console.log('[FixV5] MutationObserver已设置，正在监控DOM变化');
    };
    
    // 首次执行修复
    performFix();
    
    // 设置观察器
    setupObserver();
    
    // 设置定时执行 - 防止其他脚本覆盖我们的修复
    intervalIdRef.current = setInterval(() => {
      performFix();
    }, 1000);
    
    // 监听页面加载完成事件
    if (document.readyState !== 'complete') {
      window.addEventListener('load', performFix, { once: true });
    }
    
    // 添加全局修复方法
    window._fixTranslationsV5 = performFix;
    console.log('[FixV5] 已添加全局修复函数 window._fixTranslationsV5()');
    
    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      
      window.removeEventListener('load', performFix);
      delete window._fixTranslationsV5;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslationsV5?: () => void;
  }
} 