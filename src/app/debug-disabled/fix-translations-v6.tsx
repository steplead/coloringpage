'use client';

import { useEffect, useRef } from 'react';

export default function FixTranslationsV6() {
  const fixCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // 只在中文页面执行
    if (!window.location.pathname.includes('/zh')) return;
    
    console.log('[FixV6] 启动终极版翻译修复');
    
    // 直接执行修复
    const fixTranslations = () => {
      fixCountRef.current++;
      const fixId = fixCountRef.current;
      let fixCount = 0;
      
      try {
        console.log(`[FixV6 #${fixId}] 开始扫描页面`);
        
        // 1. 极其直接粗暴的方式 - 直接遍历所有元素
        document.querySelectorAll('*').forEach(el => {
          // 只处理元素节点
          if (el.nodeType !== Node.ELEMENT_NODE) return;
          
          // 最轻量的方式检查文本节点
          if (el.childNodes && el.childNodes.length > 0) {
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                
                // 处理特定的占位符文本
                if (text === 'title') {
                  // 根据父元素类型推断不同的翻译
                  if (el.tagName === 'H3') {
                    node.textContent = '描述您想要的图像';
                    fixCount++;
                  } else {
                    node.textContent = '标题';
                    fixCount++;
                  }
                } else if (text === 'description') {
                  node.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
                  fixCount++;
                } else if (text === 'elephant') {
                  node.textContent = '大象';
                  fixCount++;
                } else if (text === 'rocket') {
                  node.textContent = '火箭';
                  fixCount++;
                } else if (text === 'dragon') {
                  node.textContent = '龙';
                  fixCount++;
                }
              }
            });
          }
          
          // 特殊处理标题和按钮
          if (el.tagName === 'H3' && el.textContent?.trim() === 'title') {
            el.textContent = '描述您想要的图像';
            fixCount++;
          } else if (el.tagName === 'P' && el.textContent?.trim() === 'description') {
            el.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
            fixCount++;
          } else if (el.tagName === 'BUTTON' && el.textContent?.trim() === 'Try it') {
            el.textContent = '试一试';
            fixCount++;
          }
        });
        
        // 2. 针对特定布局结构的精准修复 - 使用方法部分的卡片
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
        
        // 3. 针对图库中的示例翻译
        document.querySelectorAll('.grid > a').forEach(card => {
          const title = card.querySelector('h3, h4');
          if (title) {
            if (title.textContent === 'elephant') {
              title.textContent = '大象';
              fixCount++;
            } else if (title.textContent === 'rocket') {
              title.textContent = '火箭';
              fixCount++;
            } else if (title.textContent === 'dragon') {
              title.textContent = '龙';
              fixCount++;
            }
          }
        });
        
        // 4. 尝试更直接的DOM选择 - 无视CSS类
        document.querySelectorAll('.card, .method-card, .feature-card, [class*="card"]').forEach(card => {
          const title = card.querySelector('h3');
          const desc = card.querySelector('p');
          
          if (title && title.textContent?.trim() === 'title') {
            title.textContent = '描述您想要的图像';
            fixCount++;
          }
          
          if (desc && desc.textContent?.trim() === 'description') {
            desc.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
            fixCount++;
          }
        });
        
        if (fixCount > 0) {
          console.log(`[FixV6 #${fixId}] 修复了 ${fixCount} 处翻译`);
        } else {
          console.log(`[FixV6 #${fixId}] 没有发现需要修复的内容`);
        }
      } catch (error) {
        console.error(`[FixV6 #${fixId}] 修复过程中出错:`, error);
      }
    };
    
    // 直接注入内联脚本，使其在HTML解析时就执行，确保最快速度修复文本
    const injectDirectScript = () => {
      try {
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            console.log('[FixV6-Inline] 执行直接修复');
            
            // 等待DOM树构建
            function fixTranslations() {
              var fixes = 0;
              
              // 替换所有title和description文本
              document.querySelectorAll('h3, p').forEach(function(el) {
                if (el.textContent === 'title') {
                  el.textContent = '描述您想要的图像';
                  fixes++;
                } else if (el.textContent === 'description') {
                  el.textContent = '输入文字描述，我们的AI将创建匹配的涂色页';
                  fixes++;
                }
              });
              
              // 示例图片标题
              document.querySelectorAll('h3, h4').forEach(function(el) {
                if (el.textContent === 'elephant') {
                  el.textContent = '大象';
                  fixes++;
                } else if (el.textContent === 'rocket') {
                  el.textContent = '火箭';
                  fixes++;
                } else if (el.textContent === 'dragon') {
                  el.textContent = '龙';
                  fixes++;
                }
              });
              
              if (fixes > 0) {
                console.log('[FixV6-Inline] 直接修复了 ' + fixes + ' 处翻译');
              }
            }
            
            // 立即执行一次
            fixTranslations();
            
            // 在DOM内容加载后再次执行
            document.addEventListener('DOMContentLoaded', fixTranslations);
            
            // 在完全加载后再次执行
            window.addEventListener('load', fixTranslations);
            
            // 定期执行
            setInterval(fixTranslations, 500);
          })();
        `;
        document.head.appendChild(script);
        console.log('[FixV6] 注入了内联修复脚本');
      } catch (error) {
        console.error('[FixV6] 注入内联脚本失败:', error);
      }
    };
    
    // 添加MutationObserver监控DOM变化
    const setupObserver = () => {
      // 创建一个观察器实例
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const observer = new MutationObserver((_mutations) => {
        // 延迟执行修复，让React完成其工作
        requestAnimationFrame(fixTranslations);
      });
      
      // 开始观察document.body，监控其子树和文本变化
      observer.observe(document.body, { childList: true, subtree: true });
      
      console.log('[FixV6] 设置了MutationObserver监控DOM变化');
      
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
            console.log('[FixV6] 拦截到翻译API请求:', url);
            
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
        
        console.log('[FixV6] 已覆盖fetch API');
      } catch (error) {
        console.error('[FixV6] 覆盖API时出错:', error);
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
    
    // 设置定期执行修复
    intervalRef.current = setInterval(fixTranslations, 500);
    
    // 添加全局访问函数
    window._fixTranslationsV6 = fixTranslations;
    console.log('[FixV6] 已添加全局修复函数 window._fixTranslationsV6()');
    
    // 清理函数
    return () => {
      // 移除MutationObserver
      observer.disconnect();
      
      // 清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // 移除全局函数
      delete window._fixTranslationsV6;
    };
  }, []);
  
  return null;
}

// 添加全局类型声明
declare global {
  interface Window {
    _fixTranslationsV6?: () => void;
    _isTranslationFixed?: boolean;
  }
} 
 