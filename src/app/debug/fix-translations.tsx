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

// 用户评价部分翻译
const testimonialsContent = {
  sectionTitle: '用户评价',
  testimonials: [
    {
      text: '我的孩子们喜欢这些涂色页！每次我们都能创建新的独特图案。',
      author: '李明，两个孩子的父亲'
    },
    {
      text: '作为一名教师，这是我找到的最好的资源之一。我可以为我的学生创建主题涂色页。',
      author: '王老师，小学教师'
    },
    {
      text: '我用它来放松和减压。创建自己想象的场景然后给它上色非常有趣。',
      author: '张女士，艺术爱好者'
    }
  ],
  cta: '立即开始创建'
};

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
    
    // 修复"使用方法"部分
    const fixHowItWorks = () => {
      try {
        // 更通用的方法寻找"使用方法"部分
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
        console.error('[FixTranslations] 修复使用方法部分时出错:', error);
      }
    };
    
    // 修复"用户评价"部分
    const fixTestimonials = () => {
      try {
        // 查找用户评价部分
        // 可能的标题文本
        const possibleTitles = ['用户评价', 'What Our Users Say', 'home.testimonials.title'];
        let testimonialsSection: HTMLElement | null = null;
        
        // 通过标题文本查找
        const allSections = document.querySelectorAll('section');
        for (let i = 0; i < allSections.length; i++) {
          const section = allSections[i];
          const h2 = section.querySelector('h2');
          if (h2 && possibleTitles.some(title => h2.textContent?.includes(title))) {
            testimonialsSection = section as HTMLElement;
            console.log('[Debug] 找到用户评价部分:', h2.textContent);
            break;
          }
        }
        
        // 如果找到了部分
        if (testimonialsSection) {
          // 更新标题
          const sectionTitle = testimonialsSection.querySelector('h2');
          if (sectionTitle) {
            console.log('[Debug] 原用户评价标题:', sectionTitle.textContent);
            sectionTitle.textContent = testimonialsContent.sectionTitle;
          }
          
          // 查找评价卡片
          const testimonialCards = testimonialsSection.querySelectorAll('.grid > div, .md\\:grid-cols-3 > div');
          
          if (!testimonialCards || testimonialCards.length === 0) {
            // 尝试更通用的选择器
            const allDivs = testimonialsSection.querySelectorAll('div');
            // 找出所有可能包含评价的div
            const possibleCards = Array.from(allDivs).filter(div => {
              const text = div.textContent || '';
              return (
                text.includes('home.testimonials.1') ||
                text.includes('home.testimonials.2') ||
                text.includes('home.testimonials.3') ||
                (div.querySelector('p') && div.querySelector('p')?.nextElementSibling?.tagName === 'P')
              );
            });
            
            console.log('[Debug] 找到可能的评价卡片数量:', possibleCards.length);
            
            // 修复每个评价卡片
            possibleCards.forEach((card, index) => {
              if (index >= testimonialsContent.testimonials.length) return;
              
              // 查找文本和作者元素
              const paragraphs = card.querySelectorAll('p');
              if (paragraphs.length >= 2) {
                const textElem = paragraphs[0];
                const authorElem = paragraphs[1];
                
                console.log(`[Debug] 评价 ${index+1} 原文本:`, textElem.textContent);
                console.log(`[Debug] 评价 ${index+1} 原作者:`, authorElem.textContent);
                
                // 检查是否包含翻译键
                if (
                  textElem.textContent?.includes('home.testimonials') || 
                  textElem.textContent?.trim() === '"home.testimonials.1.text"' ||
                  textElem.textContent?.trim() === '"home.testimonials.2.text"' ||
                  textElem.textContent?.trim() === '"home.testimonials.3.text"'
                ) {
                  // 更新文本
                  const testimonial = testimonialsContent.testimonials[index];
                  textElem.textContent = `"${testimonial.text}"`;
                  authorElem.textContent = `- ${testimonial.author}`;
                  console.log(`[Debug] 已更新评价 ${index+1}`);
                }
              }
            });
            
            // 修复"立即开始创建"按钮
            const ctaButton = testimonialsSection.querySelector('a');
            if (ctaButton && ctaButton.textContent?.includes('home.testimonials.cta')) {
              ctaButton.textContent = testimonialsContent.cta;
              console.log('[Debug] 已更新CTA按钮文本');
            }
            
            console.log('[FixTranslations] 已修复用户评价部分的翻译');
          }
        } else {
          console.error('[Debug] 无法找到用户评价部分');
        }
      } catch (error) {
        console.error('[FixTranslations] 修复用户评价部分时出错:', error);
      }
    };
    
    // 执行所有修复
    const fixAllTranslations = () => {
      debugPageStructure(); // 记录页面结构
      fixHowItWorks();      // 修复"使用方法"部分
      fixTestimonials();    // 修复"用户评价"部分
    };
    
    // 等待页面完全加载后再执行修复
    if (document.readyState === 'complete') {
      fixAllTranslations();
    } else {
      window.addEventListener('load', fixAllTranslations);
    }
    
    // 设置多个延时调用，确保在不同时间点尝试修复
    const timerIds = [
      setTimeout(fixAllTranslations, 1000),
      setTimeout(fixAllTranslations, 2000),
      setTimeout(fixAllTranslations, 3000),
      setTimeout(fixAllTranslations, 5000)
    ];
    
    // 监听DOM变化，当有新元素加载时再次尝试修复
    const observer = new MutationObserver((mutations) => {
      const shouldFix = mutations.some(mutation => 
        mutation.addedNodes.length > 0 || 
        (mutation.type === 'attributes' && mutation.attributeName === 'class')
      );
      
      if (shouldFix) {
        console.log('[Debug] DOM已更新，尝试修复翻译');
        fixAllTranslations();
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
      window.removeEventListener('load', fixAllTranslations);
    };
  }, []);
  
  // 这个组件不渲染任何内容，只执行副作用
  return null;
} 