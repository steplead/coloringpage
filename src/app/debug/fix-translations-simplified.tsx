'use client';

import { useEffect, useRef } from 'react';

// 简化版本 - 避免TypeScript错误和复杂的DOM API交互
export default function FixTranslationsSimplified() {
  const fixCountRef = useRef(0);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[简化版] 启动翻译修复');

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
      
      console.log(`[简化版 #${fixId}] 开始扫描修复`);
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
        console.log(`[简化版 #${fixId}] 修复了 ${fixedCount} 处翻译`);
      }
    };
    
    // 执行初始修复
    performFix();
    
    // 设置定时执行
    const interval1 = window.setInterval(performFix, 500);
    const interval2 = window.setInterval(performFix, 3000);
    
    // 页面加载完成后再次修复
    if (document.readyState !== 'complete') {
      window.addEventListener('load', performFix);
    }
    
    // 添加全局方法
    window._fixTranslationsSimplified = performFix;
    console.log('[简化版] 已添加全局修复函数 window._fixTranslationsSimplified()');
    
    // 清理
    return () => {
      window.clearInterval(interval1);
      window.clearInterval(interval2);
      window.removeEventListener('load', performFix);
      delete window._fixTranslationsSimplified;
    };
  }, []);
  
  return null;
}

// TypeScript类型声明
declare global {
  interface Window {
    _fixTranslationsSimplified?: () => void;
  }
} 