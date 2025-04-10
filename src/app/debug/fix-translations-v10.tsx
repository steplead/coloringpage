'use client';

import { useEffect, useRef } from 'react';

// 关键文本的翻译字典
const translations: Record<string, string> = {
  // 导航栏
  'ColoBuddy': 'ColorBuddy绘彩伙伴',
  'Gallery': '图库',
  'Create': '创建',
  'Generate Image': '生成图像',
  'Search in gallery': '在图库中搜索',
  
  // 首页
  'Turn your pictures into coloring pages': '将您的图片转换为涂色页',
  'Fast and free coloring page generator.': '快速免费的涂色页生成器。',
  'Upload your photo': '上传您的照片',
  'Our Gallery': '我们的图库',
  'The best AI coloring pages generator online': '最佳在线AI涂色页生成器',
  
  // 特性部分
  'Print Ready': '打印就绪',
  'Perfect quality for printing at any size': '适合任何尺寸打印的完美质量',
  'Kid Friendly': '儿童友好',
  'Simple enough for kids to use on their own': '简单到孩子们可以自己使用',
  'Private & Secure': '安全私密',
  'No account needed, your creations belong to you': '无需账户，您的创作属于您',
  'Full Control': '完全控制',
  'Adjust every detail to your liking': '根据您的喜好调整每个细节',
  
  // 创建页面
  'Create your coloring page': '创建您的涂色页',
  'Upload a photo or choose one from our gallery': '上传照片或从我们的图库中选择',
  'Drop your image here, or click to select': '将图片拖放至此，或点击选择',
  'JPG, PNG or WEBP (max. 5MB)': 'JPG、PNG或WEBP格式（最大5MB）',
  'or choose from gallery': '或从图库中选择',
  
  // 生成页面
  'Creating your coloring page...': '正在创建您的涂色页...',
  'This will take a few seconds': '这将需要几秒钟时间',
  'Your coloring page is ready!': '您的涂色页已准备就绪！',
  'Download': '下载',
  'Share': '分享',
  'Detail level': '细节水平',
  'Line thickness': '线条粗细',
  'Smoothness': '平滑度',
  'Brightness': '亮度',
  'Invert colors': '反转颜色',
  'Reset': '重置',
  'Back to gallery': '返回图库',
  
  // 图库页面
  'Coloring Pages Gallery': '涂色页图库',
  'Browse and find the perfect coloring page': '浏览并找到完美的涂色页',
  'Most popular': '最受欢迎',
  'Animals': '动物',
  'Nature': '自然',
  'People': '人物',
  'Fantasy': '幻想',
  'Mandalas': '曼陀罗',
  'Buildings': '建筑',
  'Food': '食物',
  'Vehicles': '交通工具',
  'Use this image': '使用此图像',
  
  // 其他通用元素
  'Loading...': '加载中...',
  'Error': '错误',
  'Submit': '提交',
  'Cancel': '取消',
  'Next': '下一步',
  'Previous': '上一步',
  'Close': '关闭',
  'Open': '打开',
  'Save': '保存',
  'Delete': '删除',
  'Edit': '编辑',
  'View': '查看',
  
  // 占位符文本 - 这些是特别需要修复的关键项
  'title': '标题',
  'description': '描述',
  
  // 按钮文本
  'DOWNLOAD PNG': '下载PNG',
  'DOWNLOAD PDF': '下载PDF',
  'Try again': '重试',
  
  // 特殊处理的元素
  'Adjust settings': '调整设置',
  
  // 关键翻译
  'home.features.print.title': '打印就绪',
  'home.features.print.desc': '适合任何尺寸打印的完美质量',
  'home.features.easy.title': '儿童友好', 
  'home.features.easy.desc': '简单到孩子们可以自己使用',
  'home.features.secure.title': '安全私密',
  'home.features.secure.desc': '无需账户，您的创作属于您',
  'home.features.control.title': '完全控制',
  'home.features.control.desc': '根据您的喜好调整每个细节',
  
  // 直接特性面板翻译
  'Why Choose Our AI Coloring Page Generator?': '为什么选择我们的AI涂色页生成器？'
};

// 具体针对特定元素的修复规则
const specificFixRules = [
  // 特性卡片修复 (针对.grid div中内容为"title"的h3元素)
  {
    selector: '.grid div h3, .features div h3',
    pattern: 'title',
    translations: {
      0: '打印就绪',
      1: '儿童友好', 
      2: '安全私密',
      3: '完全控制',
      4: '高质量打印',
      5: '儿童友好界面',
      6: '安全可靠',
      7: '完全定制'
    }
  },
  // 特性卡片描述修复
  {
    selector: '.grid div p, .features div p',
    pattern: 'description',
    translations: {
      0: '适合任何尺寸打印的完美质量',
      1: '简单到孩子们可以自己使用',
      2: '无需账户，您的创作属于您',
      3: '根据您的喜好调整每个细节',
      4: '生成高分辨率图像，确保打印清晰',
      5: '易于使用的界面，适合所有年龄段',
      6: '不保存个人数据，保护您的隐私',
      7: '提供多种选项来自定义您的涂色页'
    }
  }
];

// 强制修复类型的定义
type FixFunction = () => number;
type TranslationSetter = (el: Element, text: string) => void;

export default function FixTranslationsV10() {
  const isProcessingRef = useRef(false);
  const fixCountRef = useRef(0);
  const fixCountTotalRef = useRef(0);
  const originalNodeTextContentSetterRef = useRef<any>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    console.log('[FixV10] 启动终极版翻译修复程序');
    
    // ===== 1. 补丁应用函数和工具 =====
    
    // 安全设置元素文本，避免触发React的状态更新
    const safeSetText = (element: Element, text: string) => {
      if (!element || element.textContent === text) return false;
      
      try {
        isProcessingRef.current = true;
        
        // 直接设置Text节点内容而不是元素的textContent
        // 这样可以避免触发某些React事件监听器
        const childNodes = element.childNodes;
        if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
          (childNodes[0] as Text).nodeValue = text;
          return true;
        } else {
          // 清空节点并创建新的文本节点
          element.textContent = '';
          element.appendChild(document.createTextNode(text));
          return true;
        }
      } catch (error) {
        console.error('[FixV10] 设置文本时出错:', error);
        return false;
      } finally {
        isProcessingRef.current = false;
      }
    };
    
    // 直接修改DOM API的setter方法
    const patchDOMTextContentSetter = () => {
      try {
        // 保存原始的setter方法以便清理
        if (!originalNodeTextContentSetterRef.current) {
          originalNodeTextContentSetterRef.current = Object.getOwnPropertyDescriptor(
            Node.prototype, 'textContent'
          )?.set;
        }
        
        // 如果无法获取原始方法，则退出
        if (!originalNodeTextContentSetterRef.current) {
          console.error('[FixV10] 无法获取Node.prototype.textContent setter');
          return;
        }
        
        // 创建自定义setter来拦截文本内容设置
        const customTextContentSetter = function(this: Node, value: string) {
          if (isProcessingRef.current || !value || typeof value !== 'string') {
            // 使用原始setter设置值
            originalNodeTextContentSetterRef.current.call(this, value);
            return;
          }
          
          // 检查文本是否需要翻译
          const trimmed = value.trim();
          if (translations[trimmed]) {
            // 记录找到翻译的情况
            console.log(`[FixV10] 拦截设置文本: "${trimmed}" => "${translations[trimmed]}"`);
            originalNodeTextContentSetterRef.current.call(this, translations[trimmed]);
            fixCountRef.current++;
            fixCountTotalRef.current++;
          } else {
            // 常规文本不需要翻译
            originalNodeTextContentSetterRef.current.call(this, value);
          }
        };
        
        // 应用自定义setter
        Object.defineProperty(Node.prototype, 'textContent', {
          set: customTextContentSetter,
          get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')?.get,
          configurable: true
        });
        
        console.log('[FixV10] 成功修补了DOM textContent API');
      } catch (error) {
        console.error('[FixV10] 修补DOM API失败:', error);
      }
    };
    
    // 处理特定的修复规则
    const applySpecificFixes = (): number => {
      let fixCount = 0;
      
      specificFixRules.forEach((rule, ruleIndex) => {
        // 获取所有匹配选择器的元素
        const elements = document.querySelectorAll(rule.selector);
        
        elements.forEach((el, index) => {
          // 判断元素是否包含pattern文本
          if (el.textContent?.trim() === rule.pattern) {
            // 尝试从索引映射中获取翻译
            const translation = rule.translations[index as keyof typeof rule.translations];
            
            if (translation) {
              // 应用翻译
              if (safeSetText(el, translation)) {
                console.log(`[FixV10] 规则#${ruleIndex} 修复索引${index}: "${rule.pattern}" => "${translation}"`);
                fixCount++;
              }
            }
          }
        });
      });
      
      return fixCount;
    };
    
    // ===== 2. 主要修复函数 =====
    
    // 修复所有文本节点
    const fixAllTextNodes = (): number => {
      console.log('[FixV10] 开始修复所有文本节点...');
      let fixCount = 0;
      
      try {
        isProcessingRef.current = true;
        
        // 创建TreeWalker来遍历所有文本节点
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        // 收集需要修复的节点
        const nodesToFix: Array<{node: Text, newValue: string}> = [];
        
        // 首先遍历并标记
        let textNode = walker.nextNode() as Text | null;
        while (textNode) {
          const text = textNode.nodeValue?.trim();
          if (text && translations[text] && textNode.nodeValue !== translations[text]) {
            nodesToFix.push({
              node: textNode,
              newValue: translations[text]
            });
          }
          textNode = walker.nextNode() as Text | null;
        }
        
        // 然后更新所有节点
        nodesToFix.forEach(({node, newValue}) => {
          node.nodeValue = newValue;
          fixCount++;
          console.log(`[FixV10] 修复文本节点: "${node.nodeValue?.trim()}" => "${newValue}"`);
        });
        
      } catch (error) {
        console.error('[FixV10] 修复文本节点时出错:', error);
      } finally {
        isProcessingRef.current = false;
      }
      
      return fixCount;
    };
    
    // 修复所有元素的文本内容
    const fixAllElements = (): number => {
      let fixCount = 0;
      
      try {
        // 选择所有可能包含文本的元素
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label, div, li');
        
        elements.forEach(el => {
          // 如果元素只有一个文本子节点
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = el.textContent?.trim();
            if (text && translations[text] && el.textContent !== translations[text]) {
              if (safeSetText(el, translations[text])) {
                fixCount++;
              }
            }
          }
        });
        
      } catch (error) {
        console.error('[FixV10] 修复元素文本时出错:', error);
      }
      
      return fixCount;
    };
    
    // 完整修复函数
    const performFullFix = (): number => {
      // 重置当前修复计数
      fixCountRef.current = 0;
      
      // 如果当前有处理中的定时器，先清除
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      console.log('[FixV10] 开始执行完整修复...');
      
      // 1. 首先应用特定修复规则
      const specificFixCount = applySpecificFixes();
      
      // 2. 修复所有文本节点
      const textNodeFixCount = fixAllTextNodes();
      
      // 3. 修复元素文本
      const elementFixCount = fixAllElements();
      
      // 设置一个延迟，以便捕获React的后续渲染
      processingTimeoutRef.current = setTimeout(() => {
        // 如果上次修复有效果，再次尝试修复
        if (fixCountRef.current > 0) {
          performFullFix();
        }
        processingTimeoutRef.current = null;
      }, 2000);
      
      // 返回总修复数
      const totalFixed = specificFixCount + textNodeFixCount + elementFixCount;
      console.log(`[FixV10] 完整修复完成: 特定规则=${specificFixCount}, 文本节点=${textNodeFixCount}, 元素=${elementFixCount}`);
      
      // 更新总修复计数
      fixCountTotalRef.current += totalFixed;
      
      return totalFixed;
    };
    
    // ===== 3. 设置观察者和触发器 =====
    
    // 创建DOM变更观察器
    const setupMutationObserver = () => {
      const observer = new MutationObserver((mutations) => {
        // 检查是否有相关变更
        let needsFix = false;
        
        for (const mutation of mutations) {
          if (isProcessingRef.current) continue;
          
          if (
            mutation.type === 'childList' || 
            mutation.type === 'characterData'
          ) {
            needsFix = true;
            break;
          }
        }
        
        if (needsFix) {
          // 使用requestAnimationFrame确保在下一帧执行修复
          requestAnimationFrame(() => {
            console.log('[FixV10] DOM变更触发修复');
            performFullFix();
          });
        }
      });
      
      // 开始观察整个body
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      console.log('[FixV10] DOM变更观察器已设置');
      
      return observer;
    };
    
    // 拦截React的setState
    const patchReactSetState = () => {
      try {
        // 查找React Fiber节点
        const findReactRoot = () => {
          // 尝试查找React内部属性
          const reactRoots = document.querySelectorAll('[data-reactroot]');
          if (reactRoots.length > 0) {
            return Array.from(reactRoots);
          }
          
          // 或者查找React应用的根节点
          return [document.getElementById('__next') || document.getElementById('root')];
        };
        
        // 每当检测到React更新时执行修复
        const reactUpdateDetected = () => {
          console.log('[FixV10] 检测到React更新');
          
          // 等待React完成渲染
          setTimeout(() => {
            performFullFix();
          }, 50);
        };
        
        // 监听React根节点的变化
        const roots = findReactRoot();
        if (roots.length > 0 && roots[0]) {
          const rootObserver = new MutationObserver(reactUpdateDetected);
          
          roots.forEach(root => {
            if (root) {
              rootObserver.observe(root, {
                childList: true,
                subtree: true,
                attributes: true
              });
            }
          });
          
          console.log(`[FixV10] 已监听 ${roots.length} 个React根节点`);
          
          return rootObserver;
        } else {
          console.log('[FixV10] 未找到React根节点');
          return null;
        }
      } catch (error) {
        console.error('[FixV10] 修补React setState失败:', error);
        return null;
      }
    };
    
    // ===== 4. 初始化和清理 =====
    
    // 初始化修复
    console.log('[FixV10] 初始化修复流程');
    
    // 修补DOM API
    patchDOMTextContentSetter();
    
    // 立即执行第一次完整修复
    setTimeout(() => {
      performFullFix();
    }, 500);
    
    // 设置DOM观察器
    const domObserver = setupMutationObserver();
    
    // 尝试修补React
    const reactObserver = patchReactSetState();
    
    // 设置定期修复
    const fixInterval = setInterval(() => {
      performFullFix();
    }, 5000);
    
    // 暴露全局方法进行调试
    window._forceFixV10 = () => {
      console.log('[FixV10] 手动触发完整修复');
      const count = performFullFix();
      console.log(`[FixV10] 手动修复完成, 修复了 ${count} 处文本`);
      console.log(`[FixV10] 自启动以来总共修复了 ${fixCountTotalRef.current} 处文本`);
    };
    
    // 返回清理函数
    return () => {
      console.log('[FixV10] 清理修复程序...');
      
      // 清除观察器
      domObserver.disconnect();
      reactObserver?.disconnect();
      
      // 清除定时器
      clearInterval(fixInterval);
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      
      // 恢复原始DOM API
      if (originalNodeTextContentSetterRef.current) {
        try {
          Object.defineProperty(Node.prototype, 'textContent', {
            set: originalNodeTextContentSetterRef.current,
            get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')?.get,
            configurable: true
          });
        } catch (e) {
          console.error('[FixV10] 恢复原始textContent方法失败:', e);
        }
      }
      
      // 移除全局方法
      delete window._forceFixV10;
    };
  }, []);
  
  return null;
}

// 全局类型声明
declare global {
  interface Window {
    _forceFixV10?: () => void;
  }
} 
 