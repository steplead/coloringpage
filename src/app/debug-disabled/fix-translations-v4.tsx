'use client';

import { useEffect, useRef } from 'react';

// 设置版本号
const VERSION = 'V4';

// 日志前缀
const LOG_PREFIX = `[FixTranslations${VERSION}]`;

// 翻译字典
const translations: Record<string, string> = {
  // 标题翻译
  'How it works': '使用方法',
  'Describe your image': '描述您想要的图像',
  'Choose your style': '选择您喜欢的风格',
  'Download and print': '下载并打印',
  
  // 描述翻译
  'Enter a description of what you want in your coloring page, like "cat in a garden"': 
    '输入您想要涂色页的描述，例如"在花园里的小猫"',
  'Select from various art styles to customize the look of your coloring page': 
    '从多种艺术风格中选择，定制您的涂色页外观',
  'Once ready, download and print your coloring page': 
    '准备好后，下载并打印您的涂色页'
};

/**
 * 创建防抖函数
 */
function debounce<T extends unknown[]>(
  func: (...args: T) => void, 
  wait: number, 
  immediate: boolean = false
) {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(this: any, ...args: T) {
    const later = function(this: any) {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}

/**
 * V4版专注于修复"使用方法"部分的翻译
 */
export default function FixTranslationsV4() {
  const fixCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fixTriggeredRef = useRef(false);
  
  // 替换文本的主函数
  const fixTranslations = (): number => {
    try {
      console.log(`${LOG_PREFIX} 开始执行"使用方法"部分翻译修复，第${fixCountRef.current + 1}次尝试`);
      
      let replacementCount = 0;
      
      // 查找"使用方法"部分的容器
      const howItWorksSection = Array.from(document.querySelectorAll('section')).find(section => {
        const h2 = section.querySelector('h2');
        return h2 && (h2.textContent === 'How it works' || h2.textContent === '使用方法');
      });
      
      if (!howItWorksSection) {
        console.log(`${LOG_PREFIX} 未找到"使用方法"部分，可能页面尚未加载完成`);
        return 0;
      }
      
      // 处理标题
      const mainTitle = howItWorksSection.querySelector('h2');
      if (mainTitle && mainTitle.textContent === 'How it works') {
        mainTitle.textContent = '使用方法';
        replacementCount++;
        console.log(`${LOG_PREFIX} 已替换主标题`);
      }
      
      // 处理步骤容器
      const stepContainers = howItWorksSection.querySelectorAll('div > div');
      
      stepContainers.forEach((container) => {
        const title = container.querySelector('h3');
        const description = container.querySelector('p');
        
        if (title && translations[title.textContent || '']) {
          title.textContent = translations[title.textContent || ''];
          replacementCount++;
        }
        
        if (description && translations[description.textContent || '']) {
          description.textContent = translations[description.textContent || ''];
          replacementCount++;
        }
      });
      
      // 更新计数并记录结果
      fixCountRef.current++;
      console.log(`${LOG_PREFIX} 本次修复完成，替换了${replacementCount}处文本`);
      
      // 如果已经修复过足够次数且没有找到可替换的内容，则考虑停止
      if (fixCountRef.current > 10 && replacementCount === 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log(`${LOG_PREFIX} 连续10次未发现需要替换的内容，停止检查`);
        }
      }
      
      return replacementCount;
    } catch (error) {
      console.error(`${LOG_PREFIX} 修复过程中出错:`, error);
      return 0;
    }
  };
  
  // 创建一个防抖版本的翻译修复函数
  const debouncedFixTranslations = debounce(() => {
    fixTriggeredRef.current = true;
    fixTranslations();
  }, 100);
  
  useEffect(() => {
    // 初始运行
    console.log(`${LOG_PREFIX} 组件已加载，开始初始化翻译修复程序`);
    
    // 立即执行一次
    setTimeout(() => {
      fixTranslations();
    }, 500);
    
    // 保存原始方法的引用
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    // 重新实现setTimeout，添加翻译修复功能
    const newSetTimeout = function(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
      const wrappedCallback = function(this: unknown) {
        // 执行原始回调
        if (typeof handler === 'function') {
          handler.apply(this, args);
        } else if (typeof handler === 'string') {
          eval(handler);
        }
        
        // 执行我们的翻译修复（延迟执行以确保DOM更新）
        originalSetTimeout(debouncedFixTranslations as TimerHandler, 50);
      };
      
      return originalSetTimeout(wrappedCallback as TimerHandler, timeout);
    };
    
    // 重新实现setInterval，添加翻译修复功能
    const newSetInterval = function(handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
      const wrappedCallback = function(this: unknown) {
        // 执行原始回调
        if (typeof handler === 'function') {
          handler.apply(this, args);
        } else if (typeof handler === 'string') {
          eval(handler);
        }
        
        // 执行我们的翻译修复（延迟执行以确保DOM更新）
        originalSetTimeout(debouncedFixTranslations as TimerHandler, 50);
      };
      
      return originalSetInterval(wrappedCallback as TimerHandler, timeout);
    };
    
    // 添加__promisify__属性，保持TypeScript兼容性
    Object.defineProperty(newSetTimeout, '__promisify__', { 
      value: originalSetTimeout.__promisify__, 
      enumerable: false 
    });
    Object.defineProperty(newSetInterval, '__promisify__', { 
      value: originalSetInterval.__promisify__, 
      enumerable: false 
    });
    
    // 安全地替换全局方法
    window.setTimeout = newSetTimeout as typeof window.setTimeout;
    window.setInterval = newSetInterval as typeof window.setInterval;
    
    // 建立定时检查
//    intervalRef.current = setInterval(() => {
//      fixTranslations();
//    }, 2000);
    
    // 添加全局访问点
    window._fixTranslationsV4 = fixTranslations;
    
    // 监听DOM变化
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const observer = new MutationObserver((mutationsList) => {
      // 强制延迟执行，确保React更新完成
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any)._fixTranslationsRunning) {
          // console.log('[FixV4] 修复已在运行中，跳过');
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)._fixTranslationsRunning = true;
        // console.log('[FixV4] MutationObserver 触发修复');
        fixTranslations();
      }, 0);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // 恢复原始函数
      window.setTimeout = originalSetTimeout;
      window.setInterval = originalSetInterval;
      
      // 移除全局访问点
      if ('_fixTranslationsV4' in window) {
        delete window._fixTranslationsV4;
      }
      
      // 断开观察者
      observer.disconnect();
      
      console.log(`${LOG_PREFIX} 组件已卸载，清理完成`);
    };
  }, [debouncedFixTranslations]);
  
  // 这个组件不渲染任何可见内容
  return null;
}

// 为TypeScript声明全局接口
declare global {
  interface Window {
    _fixTranslationsV4?: () => number;
  }
} 