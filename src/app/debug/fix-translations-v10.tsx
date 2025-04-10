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
const specificFixRules: {
  selector: string;
  pattern: string;
  translations: Record<number, string>;
}[] = [
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
            const translation = rule.translations[index];
            
            if (translation) {
              // 应用翻译
              if (safeSetText(el, translation)) {
                fixCount++;
                console.log(`[FixV10] 规则#${ruleIndex} 修复了 ${rule.selector}[${index}]: ${rule.pattern} => ${translation}`);
              }
            }
          }
        });
      });
      
      return fixCount;
    };
    
    // 遍历并修复所有文本节点
    const fixAllTextNodes = (): number => {
      let fixCount = 0;
      
      // 递归处理所有文本节点
      const processNode = (node: Node): void => {
        // 处理文本节点
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          const text = node.textContent.trim();
          
          // 检查文本是否需要翻译
          if (text && translations[text] && node.textContent !== translations[text]) {
            try {
              isProcessingRef.current = true;
              // 直接修改文本节点的值
              node.textContent = translations[text];
              fixCount++;
            } catch (error) {
              console.error('[FixV10] 修复文本节点出错:', error);
            } finally {
              isProcessingRef.current = false;
            }
          }
        }
        
        // 递归处理所有子节点
        else if (node.nodeType === Node.ELEMENT_NODE) {
          // 排除脚本和样式标签
          const tagName = (node as Element).tagName.toLowerCase();
          if (tagName !== 'script' && tagName !== 'style') {
            node.childNodes.forEach(processNode);
          }
        }
      };
      
      try {
        // 从body开始处理所有节点
        if (document.body) {
          processNode(document.body);
        }
      } catch (error) {
        console.error('[FixV10] 遍历DOM树出错:', error);
      }
      
      return fixCount;
    };
    
    // 修复所有元素的内容
    const fixAllElements = (): number => {
      let fixCount = 0;
      
      // 获取所有可能包含文本的元素
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label, li, div');
      
      textElements.forEach(el => {
        // 如果元素只有一个子节点且为文本节点，则检查是否需要翻译
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.textContent) {
          const text = el.textContent.trim();
          
          if (text && translations[text] && el.textContent !== translations[text]) {
            if (safeSetText(el, translations[text])) {
              fixCount++;
            }
          }
        }
      });
      
      return fixCount;
    };
    
    // 执行完整的修复流程
    const performFullFix = (): number => {
      if (isProcessingRef.current) {
        console.log('[FixV10] 已有修复正在进行中，跳过此次修复');
        return 0;
      }
      
      // 重置本次修复计数
      fixCountRef.current = 0;
      
      try {
        isProcessingRef.current = true;
        
        // 应用所有修复策略
        let totalFixed = 0;
        
        // 1. 应用特定元素修复规则
        totalFixed += applySpecificFixes();
        
        // 2. 修复所有文本节点
        totalFixed += fixAllTextNodes();
        
        // 3. 修复所有元素内容
        totalFixed += fixAllElements();
        
        // 更新总修复计数
        fixCountTotalRef.current += totalFixed;
        
        if (totalFixed > 0) {
          console.log(`[FixV10] 本次修复了 ${totalFixed} 处翻译问题，总计: ${fixCountTotalRef.current}`);
        }
        
        return totalFixed;
      } catch (error) {
        console.error('[FixV10] 执行修复时出错:', error);
        return 0;
      } finally {
        isProcessingRef.current = false;
      }
    };
    
    // 设置DOM变化观察器
    const setupMutationObserver = () => {
      // 如果浏览器支持MutationObserver
      if (typeof MutationObserver !== 'undefined') {
        // 创建一个观察器实例
        const observer = new MutationObserver((mutations) => {
          // 延迟处理，避免频繁触发修复
          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
          }
          
          processingTimeoutRef.current = setTimeout(() => {
            // 检查是否有新增的节点或文本内容变化
            const hasRelevantChanges = mutations.some(mutation => 
              mutation.type === 'childList' || 
              mutation.type === 'characterData' ||
              (mutation.type === 'attributes' && mutation.attributeName === 'class')
            );
            
            if (hasRelevantChanges) {
              performFullFix();
            }
          }, 100); // 100ms延迟，减少频繁调用
        });
        
        // 配置观察选项
        const config = {
          childList: true,     // 观察目标子节点的变动
          subtree: true,       // 观察所有后代节点
          characterData: true, // 观察节点内容或文本
          attributes: true     // 观察属性变动
        };
        
        // 开始观察document.body的所有变化
        if (document.body) {
          observer.observe(document.body, config);
          console.log('[FixV10] DOM观察器已启动');
        }
        
        // 返回清理函数
        return () => {
          observer.disconnect();
          console.log('[FixV10] DOM观察器已停止');
        };
      }
      
      return undefined;
    };
    
    // 捕获React状态更新
    const patchReactSetState = () => {
      // 尝试找到React根元素
      const findReactRoot = () => {
        // 尝试通过React开发者工具属性查找
        const possibleRoots = document.querySelectorAll('[data-reactroot], #__next, #root');
        
        if (possibleRoots.length > 0) {
          return possibleRoots[0];
        }
        
        // 如果找不到明确的React根，返回body
        return document.body;
      };
      
      // 检测到React可能更新了DOM
      const reactUpdateDetected = () => {
        // 延迟执行修复，让React完成渲染
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
        
        processingTimeoutRef.current = setTimeout(() => {
          performFullFix();
        }, 50); // 短延迟，确保React完成渲染
      };
      
      // 尝试覆盖React的setState方法
      try {
        // 找到React根元素
        const reactRoot = findReactRoot();
        
        if (reactRoot) {
          // 监听根元素的子树修改
          const observer = new MutationObserver((mutations) => {
            // 只关注可能由React更新引起的变化
            const hasReactChanges = mutations.some(mutation => 
              mutation.type === 'childList' || 
              (mutation.type === 'attributes' && 
               ['class', 'style', 'data-'].some(attr => 
                 mutation.attributeName?.startsWith(attr) || false
               )
              )
            );
            
            if (hasReactChanges) {
              reactUpdateDetected();
            }
          });
          
          // 配置React根元素观察选项
          observer.observe(reactRoot, {
            childList: true,
            subtree: true,
            attributes: true
          });
          
          console.log('[FixV10] React更新检测器已启动');
          
          // 返回清理函数
          return () => {
            observer.disconnect();
            console.log('[FixV10] React更新检测器已停止');
          };
        }
      } catch (error) {
        console.error('[FixV10] 设置React更新检测器时出错:', error);
      }
      
      return undefined;
    };
    
    // 挂载全局修复函数
    if (typeof window !== 'undefined') {
      (window as any)._forceFixV10 = () => {
        console.log('[FixV10] 手动触发修复...');
        return performFullFix();
      };
    }
    
    // ===== 2. 启动修复流程 =====
    
    // 初始化DOM API修补
    patchDOMTextContentSetter();
    
    // 设置定时器，定期进行完整修复
    const intervalId = setInterval(() => {
      performFullFix();
    }, 5000); // 每5秒进行一次完整修复
    
    // 设置DOM变化观察器
    const cleanupMutationObserver = setupMutationObserver();
    
    // 设置React更新检测
    const cleanupReactPatcher = patchReactSetState();
    
    // 执行初始修复
    setTimeout(() => {
      performFullFix();
    }, 500); // 延迟500ms执行初始修复，等待页面完全加载
    
    // 清理函数
    return () => {
      // 清理DOM变化观察器
      if (cleanupMutationObserver) {
        cleanupMutationObserver();
      }
      
      // 清理React更新检测
      if (cleanupReactPatcher) {
        cleanupReactPatcher();
      }
      
      // 清理定时器
      clearInterval(intervalId);
      
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
          console.log('[FixV10] 已恢复原始DOM API');
        } catch (error) {
          console.error('[FixV10] 恢复DOM API时出错:', error);
        }
      }
      
      // 移除全局函数
      if (typeof window !== 'undefined') {
        delete (window as any)._forceFixV10;
      }
      
      console.log('[FixV10] 翻译修复程序已清理，总计修复了 ' + fixCountTotalRef.current + ' 处翻译问题');
    };
  }, []); // 仅在组件挂载时运行一次
  
  // 这个组件不渲染任何可见内容
  return null;
}

// 为Window接口添加我们的全局函数
declare global {
  interface Window {
    _forceFixV10?: () => void;
  }
}

// 设置全局函数，便于调试
function initializeGlobalFix(forceFixFn: () => number) {
  if (typeof window !== 'undefined') {
    window._forceFixV10 = () => {
      const count = forceFixFn();
      console.log(`[FixTranslationsV10] 手动修复完成，修复了 ${count} 处文本`);
      return;
    };
  }
} 