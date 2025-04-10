'use client';

import { useEffect, useRef } from 'react';

export default function FixTranslationsV7() {
  const fixCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV7] 启动最终增强版翻译修复');
    
    // 翻译字典 - 扩展更多常见文本
    const translations: Record<string, string> = {
      'title': '标题',
      'description': '描述',
      'elephant': '大象',
      'rocket': '火箭',
      'dragon': '龙',
      'unicorn': '独角兽',
      'castle': '城堡',
      'dinosaur': '恐龙',
      'butterfly': '蝴蝶',
      'princess': '公主',
      'astronaut': '宇航员',
      'robot': '机器人',
      'fairy': '仙女',
      'pirate': '海盗',
      'mermaid': '美人鱼',
      'superhero': '超级英雄',
      'Try it': '试一试',
      'Download': '下载',
      'Generate Now': '立即生成',
      'Create': '创建',
      'Submit': '提交',
      'Cancel': '取消',
      'Save': '保存',
      'Delete': '删除',
      'Edit': '编辑',
      'Loading...': '加载中...',
      'Try the prompt examples below or create your own': '尝试下方的示例提示或创建您自己的'
    };
    
    // 上下文相关翻译 - 根据元素位置和上下文确定正确翻译
    const contextTranslations: Record<string, Record<string, string>> = {
      'title': {
        'create-h3': '描述您想要的图像',
        'style-h3': '选择您喜欢的风格',
        'settings-h3': '高级设置',
        'default': '标题'
      },
      'description': {
        'create-p': '输入文字描述，我们的AI将创建匹配的涂色页',
        'style-p': '从多种艺术风格中选择，定制您的涂色页外观',
        'settings-p': '调整细节参数，获得完全符合您需求的涂色页',
        'default': '描述'
      }
    };
    
    // 获取上下文相关翻译
    const getContextualTranslation = (text: string, element: Element): string => {
      if (!contextTranslations[text]) return translations[text] || text;
      
      // 尝试确定元素上下文
      let context = 'default';
      
      // 检查位置和父元素以确定上下文
      const parentDiv = element.closest('div');
      const index = parentDiv ? Array.from(document.querySelectorAll('.grid > div')).indexOf(parentDiv) : -1;
      
      if (index === 0) {
        context = element.tagName === 'H3' ? 'create-h3' : 'create-p';
      } else if (index === 1) {
        context = element.tagName === 'H3' ? 'style-h3' : 'style-p';
      } else if (index === 2) {
        context = element.tagName === 'H3' ? 'settings-h3' : 'settings-p';
      }
      
      return contextTranslations[text][context] || contextTranslations[text]['default'] || translations[text] || text;
    };
    
    // 直接执行修复
    const fixTranslations = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      let fixCount = 0;
      
      try {
        console.log(`[FixV7 #${fixId}] 开始扫描页面`);
        
        // 查找当前页面路径，为特定页面应用特定修复
        const currentPath = window.location.pathname;
        const isCreatePage = currentPath.includes('/create');
        
        // 1. 智能修复 - 处理文本节点和特定元素
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a, label, span').forEach(el => {
          const text = el.textContent?.trim();
          if (!text || text.length === 0) return;
          
          // 检查是否需要翻译
          if (translations[text] || contextTranslations[text]) {
            const originalText = text;
            // 优先使用上下文相关翻译
            const newText = contextTranslations[text] 
              ? getContextualTranslation(text, el)
              : translations[text];
              
            if (newText && newText !== text) {
              el.textContent = newText;
              fixCount++;
              console.log(`[FixV7] 修复: "${originalText}" -> "${newText}"`);
            }
          }
        });
        
        // 2. 针对特定页面的专门修复
        if (isCreatePage) {
          // 修复创建页面的表单标签和提示文本
          document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            const input = el as HTMLInputElement | HTMLTextAreaElement;
            if (input.placeholder === 'Enter your prompt here...') {
              input.placeholder = '在此输入您的提示词...';
              fixCount++;
            }
          });
          
          // 修复生成按钮和其他特定按钮
          document.querySelectorAll('button').forEach(button => {
            if (button.textContent?.includes('Generate')) {
              button.textContent = '生成';
              fixCount++;
            }
          });
        }
        
        // 3. 针对方法卡片的精准修复
        const methodCards = Array.from(document.querySelectorAll('.grid > div'));
        if (methodCards.length >= 3) {
          // 第一张卡片：描述
          const card1 = methodCards[0];
          const title1 = card1.querySelector('h3');
          const desc1 = card1.querySelector('p');
          if (title1 && title1.textContent?.trim() === 'title') {
            title1.textContent = '描述您想要的图像';
            fixCount++;
          }
          if (desc1 && desc1.textContent?.trim() === 'description') {
            desc1.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
            fixCount++;
          }
          
          // 第二张卡片：风格
          const card2 = methodCards[1];
          const title2 = card2.querySelector('h3');
          const desc2 = card2.querySelector('p');
          if (title2 && title2.textContent?.trim() === 'title') {
            title2.textContent = '选择您喜欢的风格';
            fixCount++;
          }
          if (desc2 && desc2.textContent?.trim() === 'description') {
            desc2.textContent = '从多种艺术风格中选择，定制您的涂色页外观';
            fixCount++;
          }
          
          // 第三张卡片：高级设置
          const card3 = methodCards[2];
          const title3 = card3.querySelector('h3');
          const desc3 = card3.querySelector('p');
          if (title3 && title3.textContent?.trim() === 'title') {
            title3.textContent = '高级设置';
            fixCount++;
          }
          if (desc3 && desc3.textContent?.trim() === 'description') {
            desc3.textContent = '调整细节参数，获得完全符合您需求的涂色页';
            fixCount++;
          }
        }
        
        // 4. 针对图库示例的翻译
        document.querySelectorAll('.grid > a, .grid > div > a').forEach(card => {
          const title = card.querySelector('h3, h4');
          if (title && translations[title.textContent?.trim() || '']) {
            const originalText = title.textContent;
            title.textContent = translations[title.textContent?.trim() || ''];
            fixCount++;
            console.log(`[FixV7] 修复图库项: "${originalText}" -> "${title.textContent}"`);
          }
        });
        
        if (fixCount > 0) {
          console.log(`[FixV7 #${fixId}] 修复了 ${fixCount} 处翻译`);
        } else {
          console.log(`[FixV7 #${fixId}] 没有发现需要修复的内容`);
        }
      } catch (error) {
        console.error(`[FixV7 #${fixId}] 修复过程中出错:`, error);
      }
    };
    
    // 直接注入内联脚本，最高优先级执行
    const injectDirectScript = () => {
      try {
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[FixV7-Inline] 执行直接修复');
            
            // 基本翻译字典
            const translations = {
              'title': '标题',
              'description': '描述',
              'elephant': '大象',
              'rocket': '火箭',
              'dragon': '龙',
              'Try it': '试一试',
              'Generate Now': '立即生成',
              'Loading...': '加载中...'
            };
            
            // 快速修复函数
            function fixTranslations() {
              var fixes = 0;
              
              // 替换常见元素文本
              document.querySelectorAll('h1, h2, h3, h4, p, button, a').forEach(function(el) {
                const text = el.textContent?.trim();
                if (text && translations[text]) {
                  el.textContent = translations[text];
                  fixes++;
                }
              });
              
              if (fixes > 0) {
                console.log('[FixV7-Inline] 直接修复了 ' + fixes + ' 处翻译');
              }
            }
            
            // 立即执行一次
            fixTranslations();
            
            // 在DOM内容加载后再次执行
            document.addEventListener('DOMContentLoaded', fixTranslations);
            
            // 在完全加载后再次执行
            window.addEventListener('load', fixTranslations);
            
            // 定期执行
            setInterval(fixTranslations, 300);
          })();
        `;
        document.head.appendChild(script);
        console.log('[FixV7] 注入了内联修复脚本');
      } catch (error) {
        console.error('[FixV7] 注入内联脚本失败:', error);
      }
    };
    
    // 添加高性能MutationObserver监控DOM变化
    const setupObserver = () => {
      // 优化的节流函数，减少修复触发频率
      let timeout: number | null = null;
      const throttledFix = () => {
        if (timeout !== null) return;
        
        timeout = window.setTimeout(() => {
          fixTranslations();
          timeout = null;
        }, 100);
      };
      
      // 创建一个观察器实例
      const observer = new MutationObserver((mutations) => {
        // 过滤掉可能的自我修改
        const relevantMutations = mutations.filter(mutation => {
          // 忽略文本节点的变化，它们可能是我们自己修改的
          if (mutation.type === 'characterData') return false;
          
          // 检查是否是添加/移除相关元素
          if (mutation.type === 'childList') {
            // 只关注添加的元素中包含需要翻译的文本的情况
            return Array.from(mutation.addedNodes).some(node => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;
              const el = node as Element;
              return el.textContent && Object.keys(translations).includes(el.textContent.trim());
            });
          }
          
          return true;
        });
        
        if (relevantMutations.length > 0) {
          throttledFix();
        }
      });
      
      // 开始观察document.body，监控其子树和文本变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      console.log('[FixV7] 设置了优化的MutationObserver监控DOM变化');
      
      // 返回观察器实例以便清理
      return observer;
    };
    
    // 抢先拦截所有可能引起重新渲染的函数
    const overrideReactApis = () => {
      try {
        // 创建全局标志
        window._isTranslationFixed = false;
        
        // 保存原始函数
        const originalFetch = window.fetch;
        
        // 重写fetch，拦截翻译API请求
        window.fetch = async function(...args) {
          const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
          
          if (url.includes('/api/i18n') && url.includes('zh')) {
            console.log('[FixV7] 拦截到翻译API请求:', url);
            
            // 执行原始fetch
            const response = await originalFetch.apply(this, args);
            
            // 在响应返回后立即修复并设置标记
            setTimeout(() => {
              fixTranslations();
              window._isTranslationFixed = true;
            }, 0);
            
            return response;
          }
          
          return originalFetch.apply(this, args);
        };
        
        console.log('[FixV7] 已覆盖fetch API');
      } catch (error) {
        console.error('[FixV7] 覆盖API时出错:', error);
      }
    };
    
    // 立即注入内联脚本
    injectDirectScript();
    
    // 立即执行第一次修复
    fixTranslations();
    
    // 设置MutationObserver
    const observer = setupObserver();
    
    // 覆盖React APIs
    overrideReactApis();
    
    // 设置定期执行修复，使用较短间隔以确保快速响应
    intervalRef.current = setInterval(fixTranslations, 300);
    
    // 添加全局访问函数
    window._fixTranslationsV7 = fixTranslations;
    console.log('[FixV7] 已添加全局修复函数 window._fixTranslationsV7()');
    
    // 用户交互后也触发修复
    document.addEventListener('click', () => {
      setTimeout(fixTranslations, 50);
    });
    
    // 清理函数
    return () => {
      // 移除MutationObserver
      observer.disconnect();
      
      // 清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // 移除全局函数
      delete window._fixTranslationsV7;
      
      // 移除点击监听器
      document.removeEventListener('click', () => {
        setTimeout(fixTranslations, 50);
      });
    };
  }, []);
  
  return null;
}

// 添加全局类型声明
declare global {
  interface Window {
    _fixTranslationsV7?: () => void;
    _isTranslationFixed?: boolean;
  }
} 

import { useEffect, useRef } from 'react';

export default function FixTranslationsV7() {
  const fixCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV7] 启动最终增强版翻译修复');
    
    // 翻译字典 - 扩展更多常见文本
    const translations: Record<string, string> = {
      'title': '标题',
      'description': '描述',
      'elephant': '大象',
      'rocket': '火箭',
      'dragon': '龙',
      'unicorn': '独角兽',
      'castle': '城堡',
      'dinosaur': '恐龙',
      'butterfly': '蝴蝶',
      'princess': '公主',
      'astronaut': '宇航员',
      'robot': '机器人',
      'fairy': '仙女',
      'pirate': '海盗',
      'mermaid': '美人鱼',
      'superhero': '超级英雄',
      'Try it': '试一试',
      'Download': '下载',
      'Generate Now': '立即生成',
      'Create': '创建',
      'Submit': '提交',
      'Cancel': '取消',
      'Save': '保存',
      'Delete': '删除',
      'Edit': '编辑',
      'Loading...': '加载中...',
      'Try the prompt examples below or create your own': '尝试下方的示例提示或创建您自己的'
    };
    
    // 上下文相关翻译 - 根据元素位置和上下文确定正确翻译
    const contextTranslations: Record<string, Record<string, string>> = {
      'title': {
        'create-h3': '描述您想要的图像',
        'style-h3': '选择您喜欢的风格',
        'settings-h3': '高级设置',
        'default': '标题'
      },
      'description': {
        'create-p': '输入文字描述，我们的AI将创建匹配的涂色页',
        'style-p': '从多种艺术风格中选择，定制您的涂色页外观',
        'settings-p': '调整细节参数，获得完全符合您需求的涂色页',
        'default': '描述'
      }
    };
    
    // 获取上下文相关翻译
    const getContextualTranslation = (text: string, element: Element): string => {
      if (!contextTranslations[text]) return translations[text] || text;
      
      // 尝试确定元素上下文
      let context = 'default';
      
      // 检查位置和父元素以确定上下文
      const parentDiv = element.closest('div');
      const index = parentDiv ? Array.from(document.querySelectorAll('.grid > div')).indexOf(parentDiv) : -1;
      
      if (index === 0) {
        context = element.tagName === 'H3' ? 'create-h3' : 'create-p';
      } else if (index === 1) {
        context = element.tagName === 'H3' ? 'style-h3' : 'style-p';
      } else if (index === 2) {
        context = element.tagName === 'H3' ? 'settings-h3' : 'settings-p';
      }
      
      return contextTranslations[text][context] || contextTranslations[text]['default'] || translations[text] || text;
    };
    
    // 直接执行修复
    const fixTranslations = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      let fixCount = 0;
      
      try {
        console.log(`[FixV7 #${fixId}] 开始扫描页面`);
        
        // 查找当前页面路径，为特定页面应用特定修复
        const currentPath = window.location.pathname;
        const isCreatePage = currentPath.includes('/create');
        
        // 1. 智能修复 - 处理文本节点和特定元素
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a, label, span').forEach(el => {
          const text = el.textContent?.trim();
          if (!text || text.length === 0) return;
          
          // 检查是否需要翻译
          if (translations[text] || contextTranslations[text]) {
            const originalText = text;
            // 优先使用上下文相关翻译
            const newText = contextTranslations[text] 
              ? getContextualTranslation(text, el)
              : translations[text];
              
            if (newText && newText !== text) {
              el.textContent = newText;
              fixCount++;
              console.log(`[FixV7] 修复: "${originalText}" -> "${newText}"`);
            }
          }
        });
        
        // 2. 针对特定页面的专门修复
        if (isCreatePage) {
          // 修复创建页面的表单标签和提示文本
          document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
            const input = el as HTMLInputElement | HTMLTextAreaElement;
            if (input.placeholder === 'Enter your prompt here...') {
              input.placeholder = '在此输入您的提示词...';
              fixCount++;
            }
          });
          
          // 修复生成按钮和其他特定按钮
          document.querySelectorAll('button').forEach(button => {
            if (button.textContent?.includes('Generate')) {
              button.textContent = '生成';
              fixCount++;
            }
          });
        }
        
        // 3. 针对方法卡片的精准修复
        const methodCards = Array.from(document.querySelectorAll('.grid > div'));
        if (methodCards.length >= 3) {
          // 第一张卡片：描述
          const card1 = methodCards[0];
          const title1 = card1.querySelector('h3');
          const desc1 = card1.querySelector('p');
          if (title1 && title1.textContent?.trim() === 'title') {
            title1.textContent = '描述您想要的图像';
            fixCount++;
          }
          if (desc1 && desc1.textContent?.trim() === 'description') {
            desc1.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
            fixCount++;
          }
          
          // 第二张卡片：风格
          const card2 = methodCards[1];
          const title2 = card2.querySelector('h3');
          const desc2 = card2.querySelector('p');
          if (title2 && title2.textContent?.trim() === 'title') {
            title2.textContent = '选择您喜欢的风格';
            fixCount++;
          }
          if (desc2 && desc2.textContent?.trim() === 'description') {
            desc2.textContent = '从多种艺术风格中选择，定制您的涂色页外观';
            fixCount++;
          }
          
          // 第三张卡片：高级设置
          const card3 = methodCards[2];
          const title3 = card3.querySelector('h3');
          const desc3 = card3.querySelector('p');
          if (title3 && title3.textContent?.trim() === 'title') {
            title3.textContent = '高级设置';
            fixCount++;
          }
          if (desc3 && desc3.textContent?.trim() === 'description') {
            desc3.textContent = '调整细节参数，获得完全符合您需求的涂色页';
            fixCount++;
          }
        }
        
        // 4. 针对图库示例的翻译
        document.querySelectorAll('.grid > a, .grid > div > a').forEach(card => {
          const title = card.querySelector('h3, h4');
          if (title && translations[title.textContent?.trim() || '']) {
            const originalText = title.textContent;
            title.textContent = translations[title.textContent?.trim() || ''];
            fixCount++;
            console.log(`[FixV7] 修复图库项: "${originalText}" -> "${title.textContent}"`);
          }
        });
        
        if (fixCount > 0) {
          console.log(`[FixV7 #${fixId}] 修复了 ${fixCount} 处翻译`);
        } else {
          console.log(`[FixV7 #${fixId}] 没有发现需要修复的内容`);
        }
      } catch (error) {
        console.error(`[FixV7 #${fixId}] 修复过程中出错:`, error);
      }
    };
    
    // 直接注入内联脚本，最高优先级执行
    const injectDirectScript = () => {
      try {
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[FixV7-Inline] 执行直接修复');
            
            // 基本翻译字典
            const translations = {
              'title': '标题',
              'description': '描述',
              'elephant': '大象',
              'rocket': '火箭',
              'dragon': '龙',
              'Try it': '试一试',
              'Generate Now': '立即生成',
              'Loading...': '加载中...'
            };
            
            // 快速修复函数
            function fixTranslations() {
              var fixes = 0;
              
              // 替换常见元素文本
              document.querySelectorAll('h1, h2, h3, h4, p, button, a').forEach(function(el) {
                const text = el.textContent?.trim();
                if (text && translations[text]) {
                  el.textContent = translations[text];
                  fixes++;
                }
              });
              
              if (fixes > 0) {
                console.log('[FixV7-Inline] 直接修复了 ' + fixes + ' 处翻译');
              }
            }
            
            // 立即执行一次
            fixTranslations();
            
            // 在DOM内容加载后再次执行
            document.addEventListener('DOMContentLoaded', fixTranslations);
            
            // 在完全加载后再次执行
            window.addEventListener('load', fixTranslations);
            
            // 定期执行
            setInterval(fixTranslations, 300);
          })();
        `;
        document.head.appendChild(script);
        console.log('[FixV7] 注入了内联修复脚本');
      } catch (error) {
        console.error('[FixV7] 注入内联脚本失败:', error);
      }
    };
    
    // 添加高性能MutationObserver监控DOM变化
    const setupObserver = () => {
      // 优化的节流函数，减少修复触发频率
      let timeout: number | null = null;
      const throttledFix = () => {
        if (timeout !== null) return;
        
        timeout = window.setTimeout(() => {
          fixTranslations();
          timeout = null;
        }, 100);
      };
      
      // 创建一个观察器实例
      const observer = new MutationObserver((mutations) => {
        // 过滤掉可能的自我修改
        const relevantMutations = mutations.filter(mutation => {
          // 忽略文本节点的变化，它们可能是我们自己修改的
          if (mutation.type === 'characterData') return false;
          
          // 检查是否是添加/移除相关元素
          if (mutation.type === 'childList') {
            // 只关注添加的元素中包含需要翻译的文本的情况
            return Array.from(mutation.addedNodes).some(node => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;
              const el = node as Element;
              return el.textContent && Object.keys(translations).includes(el.textContent.trim());
            });
          }
          
          return true;
        });
        
        if (relevantMutations.length > 0) {
          throttledFix();
        }
      });
      
      // 开始观察document.body，监控其子树和文本变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      console.log('[FixV7] 设置了优化的MutationObserver监控DOM变化');
      
      // 返回观察器实例以便清理
      return observer;
    };
    
    // 抢先拦截所有可能引起重新渲染的函数
    const overrideReactApis = () => {
      try {
        // 创建全局标志
        window._isTranslationFixed = false;
        
        // 保存原始函数
        const originalFetch = window.fetch;
        
        // 重写fetch，拦截翻译API请求
        window.fetch = async function(...args) {
          const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
          
          if (url.includes('/api/i18n') && url.includes('zh')) {
            console.log('[FixV7] 拦截到翻译API请求:', url);
            
            // 执行原始fetch
            const response = await originalFetch.apply(this, args);
            
            // 在响应返回后立即修复并设置标记
            setTimeout(() => {
              fixTranslations();
              window._isTranslationFixed = true;
            }, 0);
            
            return response;
          }
          
          return originalFetch.apply(this, args);
        };
        
        console.log('[FixV7] 已覆盖fetch API');
      } catch (error) {
        console.error('[FixV7] 覆盖API时出错:', error);
      }
    };
    
    // 立即注入内联脚本
    injectDirectScript();
    
    // 立即执行第一次修复
    fixTranslations();
    
    // 设置MutationObserver
    const observer = setupObserver();
    
    // 覆盖React APIs
    overrideReactApis();
    
    // 设置定期执行修复，使用较短间隔以确保快速响应
    intervalRef.current = setInterval(fixTranslations, 300);
    
    // 添加全局访问函数
    window._fixTranslationsV7 = fixTranslations;
    console.log('[FixV7] 已添加全局修复函数 window._fixTranslationsV7()');
    
    // 用户交互后也触发修复
    document.addEventListener('click', () => {
      setTimeout(fixTranslations, 50);
    });
    
    // 清理函数
    return () => {
      // 移除MutationObserver
      observer.disconnect();
      
      // 清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // 移除全局函数
      delete window._fixTranslationsV7;
      
      // 移除点击监听器
      document.removeEventListener('click', () => {
        setTimeout(fixTranslations, 50);
      });
    };
  }, []);
  
  return null;
}

// 添加全局类型声明
declare global {
  interface Window {
    _fixTranslationsV7?: () => void;
    _isTranslationFixed?: boolean;
  }
} 