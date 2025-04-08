'use client';

import { useEffect } from 'react';

// 使用方法部分的卡片翻译
const methodCards = [
  {
    title: '描述您想要的图像',
    description: '输入文字描述，我们的AI将创建匹配的涂色页'
  },
  {
    title: '选择您喜欢的风格',
    description: '从多种艺术风格中选择，定制您的涂色页外观'
  },
  {
    title: '高级设置',
    description: '调整细节参数，获得完全符合您需求的涂色页'
  }
];

export default function FixTranslations() {
  useEffect(() => {
    // 检测是否是中文页面
    const isChinesePage = window.location.pathname.includes('/zh');
    if (!isChinesePage) return;
    
    console.log('[FixTranslations] 开始尝试修复中文翻译');
    
    // 调试函数：记录页面中所有可能的卡片容器
    const debugPageStructure = () => {
      console.log('[Debug] 页面上的section元素:', document.querySelectorAll('section'));
      console.log('[Debug] 页面上的h2元素:', document.querySelectorAll('h2'));
      
      // 尝试找到"使用方法"部分
      const sections = document.querySelectorAll('section');
      sections.forEach((section, i) => {
        const heading = section.querySelector('h2');
        console.log(`[Debug] Section ${i}:`, heading?.textContent);
      });
    };
    
    // 等待DOM完全加载
    const fixTitles = () => {
      try {
        // 记录当前页面结构，帮助调试
        debugPageStructure();
        
        // 更通用的方法寻找"使用方法"部分
        // 首先尝试查找包含"使用方法"或"how it works"文本的标题
        let howItWorksSection: HTMLElement | null = null;
        
        // 寻找ID为how-it-works的部分
        howItWorksSection = document.getElementById('how-it-works');
        console.log('[Debug] 通过ID找到的使用方法部分:', howItWorksSection);
        
        // 如果没找到，尝试通过标题文本查找
        if (!howItWorksSection) {
          const allSections = document.querySelectorAll('section');
          for (let i = 0; i < allSections.length; i++) {
            const section = allSections[i];
            const h2 = section.querySelector('h2');
            if (h2 && (
                h2.textContent?.includes('使用方法') || 
                h2.textContent?.includes('How It Works') ||
                h2.textContent?.includes('Create Coloring')
              )) {
              howItWorksSection = section as HTMLElement;
              console.log('[Debug] 通过标题文本找到的使用方法部分:', h2.textContent);
              break;
            }
          }
        }
        
        // 如果找到了部分
        if (howItWorksSection) {
          console.log('[Debug] 找到"使用方法"部分');
          
          // 更新标题
          const sectionTitle = howItWorksSection.querySelector('h2');
          if (sectionTitle) {
            console.log('[Debug] 原标题:', sectionTitle.textContent);
            sectionTitle.textContent = '使用方法';
            console.log('[Debug] 已更新标题为"使用方法"');
          }
          
          // 查找该部分中的所有卡片
          // 先尝试特定类名
          let cards = howItWorksSection.querySelectorAll('.grid > div');
          
          // 如果没找到，尝试更通用的选择器
          if (!cards || cards.length === 0) {
            cards = howItWorksSection.querySelectorAll('div > div');
            console.log('[Debug] 使用通用选择器找到的卡片数量:', cards.length);
          }
          
          // 筛选出具有标题和描述的卡片
          const validCards = Array.from(cards).filter(card => 
            card.querySelector('h3') && card.querySelector('p')
          );
          
          console.log('[Debug] 有效卡片数量:', validCards.length);
          
          // 如果找到了合适数量的卡片
          if (validCards.length >= 3) {
            // 只处理前三个卡片
            for (let i = 0; i < 3; i++) {
              if (i >= validCards.length) break;
              
              const card = validCards[i];
              const title = card.querySelector('h3');
              const desc = card.querySelector('p');
              
              console.log(`[Debug] 卡片 ${i+1} 原标题:`, title?.textContent);
              console.log(`[Debug] 卡片 ${i+1} 原描述:`, desc?.textContent);
              
              // 更新标题
              if (title) {
                title.textContent = methodCards[i].title;
              }
              
              // 更新描述
              if (desc) {
                desc.textContent = methodCards[i].description;
              }
              
              console.log(`[Debug] 卡片 ${i+1} 已更新`);
            }
            
            console.log('[FixTranslations] 已修复使用方法部分的翻译');
          } else {
            console.error('[Debug] 没有找到足够的卡片进行修复');
          }
        } else {
          console.error('[Debug] 无法找到"使用方法"部分');
        }
      } catch (error) {
        console.error('[FixTranslations] 修复翻译时出错:', error);
      }
    };
    
    // 等待页面完全加载后再执行修复
    if (document.readyState === 'complete') {
      fixTitles();
    } else {
      window.addEventListener('load', fixTitles);
    }
    
    // 设置多个延时调用，确保在不同时间点尝试修复
    const timerIds = [
      setTimeout(fixTitles, 1000),
      setTimeout(fixTitles, 2000),
      setTimeout(fixTitles, 3000)
    ];
    
    // 监听DOM变化，当有新元素加载时再次尝试修复
    const observer = new MutationObserver((mutations) => {
      const shouldFix = mutations.some(mutation => 
        mutation.addedNodes.length > 0 || 
        (mutation.type === 'attributes' && mutation.attributeName === 'class')
      );
      
      if (shouldFix) {
        console.log('[Debug] DOM已更新，尝试修复翻译');
        fixTitles();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true
    });
    
    // 清理函数
    return () => {
      timerIds.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('load', fixTitles);
    };
  }, []);
  
  // 这个组件不渲染任何内容，只执行副作用
  return null;
} 