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
    
    // 等待DOM完全加载
    const fixTitles = () => {
      try {
        // 找到所有title和description元素 (位于"使用方法"部分)
        const sectionTitle = document.querySelector('#how-it-works h2');
        if (sectionTitle && sectionTitle.textContent?.trim() === 'Create Coloring Pages Your Way') {
          sectionTitle.textContent = '使用方法';
        }
        
        // 查找所有的方法卡片
        const cards = document.querySelectorAll('#how-it-works .grid > div');
        if (cards && cards.length === 3) {
          cards.forEach((card, index) => {
            // 找到卡片中的标题和描述
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            
            // 如果找到了title元素并且内容是英文或占位符，替换为中文
            if (title && (title.textContent?.trim() === 'title' || title.textContent?.includes('describe') || title.textContent?.includes('style') || title.textContent?.includes('advanced'))) {
              title.textContent = methodCards[index].title;
            }
            
            // 如果找到了description元素并且内容是英文或占位符，替换为中文
            if (desc && (desc.textContent?.trim() === 'description' || desc.textContent?.includes('description'))) {
              desc.textContent = methodCards[index].description;
            }
          });
        }
        
        console.log('[FixTranslations] 已修复使用方法部分的翻译');
      } catch (error) {
        console.error('[FixTranslations] 修复翻译时出错:', error);
      }
    };
    
    // 尝试立即修复
    fixTitles();
    
    // 如果DOM尚未完全加载，等待1秒后再次尝试
    const timerId = setTimeout(fixTitles, 1000);
    
    // 监听DOM变化，当有新元素加载时再次尝试修复
    const observer = new MutationObserver(fixTitles);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // 清理函数
    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, []);
  
  // 这个组件不渲染任何内容，只执行副作用
  return null;
} 