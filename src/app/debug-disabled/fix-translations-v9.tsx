'use client';

import { useEffect, useRef } from 'react';

// 翻译字典 - 直接替换页面上的文本内容
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
  
  // 占位符文本
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
  'home.features.control.desc': '根据您的喜好调整每个细节'
};

// 创建一个强引用的Hook，阻止React的渲染清理掉我们的修复
export default function FixTranslationsV9() {
  const isProcessingRef = useRef(false);
  const fixCountRef = useRef(0);
  const originalSetTextContentRef = useRef<((this: Node, value: string | null) => void) | null>(null);
  
  useEffect(() => {
    console.log('[FixV9] 初始化React渲染拦截器');

    // 直接修改页面的textContent设置方法，拦截任何文本更新
    function patchDOM() {
      try {
        if (!originalSetTextContentRef.current) {
          // 保存原始的setter方法以便清理，确保它是函数
          const originalSetter = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')?.set;
          if (typeof originalSetter === 'function') {
            originalSetTextContentRef.current = originalSetter;
          } else {
            console.error('[FixV9] 无法获取 Node.prototype.textContent setter 函数');
            originalSetTextContentRef.current = null;
          }
        }
        
        // 如果无法获取原始方法，则退出
        if (!originalSetTextContentRef.current) {
            console.error('[FixV9] 未能成功获取原始 setter，无法修补');
            return;
        }
        
        // 创建拦截的setter
        const newSetter = function(this: Node, value: string) {
          // 如果不是正在处理中，并且值是可翻译的，拦截它
          if (!isProcessingRef.current && value && typeof value === 'string') {
            const trimmedValue = value.trim();
            if (translations[trimmedValue]) {
              // 记录翻译替换
              console.log(`[FixV9] 拦截设置textContent: "${trimmedValue}" => "${translations[trimmedValue]}"`);
              
              // 设置处理标志防止递归
              isProcessingRef.current = true;
              
              // 调用原始方法但使用翻译的文本 (添加null检查)
              if (originalSetTextContentRef.current) {
                  originalSetTextContentRef.current.call(this, translations[trimmedValue]);
              }
              
              // 重置处理标志
              isProcessingRef.current = false;
              
              // 增加计数
              fixCountRef.current++;
              
              return;
            }
          }
          
          // 对于不需要翻译的文本，使用原始方法
          // 使用原始setter设置值 (添加null检查)
          if (originalSetTextContentRef.current) {
              originalSetTextContentRef.current.call(this, value);
          }
        };
        
        // 替换原始方法
        Object.defineProperty(Node.prototype, 'textContent', {
          set: newSetter,
          // 保持getter不变
          get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')?.get, // Add optional chaining
          configurable: true
        });
        
        console.log('[FixV9] 成功修补DOM textContent方法');
      } catch (error) {
        console.error('[FixV9] 修补DOM方法时出错:', error);
      }
    }
    
    // 拦截React的批量更新
    function patchReactDOM() {
      try {
        console.log('[FixV9] 开始修补React DOM更新方法');
        
        // 修复当前页面上的所有文本节点
        const fixAllTexts = () => {
          console.log('[FixV9] 开始修复当前页面上的所有文本');
          let fixCount = 0;
          
          // 获取所有文本节点
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          );
          
          const nodesToFix: Text[] = [];
          let node: Text | null;
          while (node = walker.nextNode() as Text) {
            if (node.nodeValue && node.nodeValue.trim()) {
              nodesToFix.push(node);
            }
          }
          
          // 修复所有文本节点
          isProcessingRef.current = true; // 防止递归
          
          nodesToFix.forEach(textNode => {
            const text = textNode.nodeValue?.trim();
            if (text && translations[text]) {
              textNode.nodeValue = translations[text];
              fixCount++;
            }
          });
          
          isProcessingRef.current = false; // 恢复正常操作
          
          if (fixCount > 0) {
            console.log(`[FixV9] 已修复 ${fixCount} 个文本节点`);
          }
          
          // 特别处理带有placeholder的输入框
          document.querySelectorAll('[placeholder]').forEach(el => {
            const input = el as HTMLInputElement;
            const placeholder = input.getAttribute('placeholder');
            if (placeholder && translations[placeholder]) {
              input.setAttribute('placeholder', translations[placeholder]);
              fixCount++;
            }
          });
          
          return fixCount;
        };
        
        // 在页面稳定后执行修复
        setTimeout(() => {
          fixAllTexts();
        }, 1000);
        
        // 设置MutationObserver监视DOM变化
        const observer = new MutationObserver((mutations) => {
          // 检查是否有新增的节点或文本变化
          let shouldFix = false;
          
          mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              shouldFix = true;
            }
          });
          
          if (shouldFix && !isProcessingRef.current) {
            setTimeout(() => {
              fixAllTexts();
            }, 0);
          }
        });
        
        // 开始监视
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
        
        // 设置定时器定期检查整个页面
        const interval = setInterval(() => {
          if (!isProcessingRef.current) {
            fixAllTexts();
          }
        }, 2000);
        
        // 强制重新渲染的函数 (用于调试)
        window._forceFixV9 = () => {
          console.log('[FixV9] 执行强制修复');
          isProcessingRef.current = false;
          const count = fixAllTexts();
          console.log(`[FixV9] 强制修复了 ${count} 个节点`);
        };
        
        // 返回清理函数
        return () => {
          observer.disconnect();
          clearInterval(interval);
          delete window._forceFixV9;
          
          // 如果可能，恢复原始方法
          if (originalSetTextContentRef.current) {
            try {
              Object.defineProperty(Node.prototype, 'textContent', {
                set: originalSetTextContentRef.current,
                // @ts-expect-error
                get: Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').get,
                configurable: true
              });
            } catch (e) {
              console.error('[FixV9] 无法恢复原始textContent方法');
            }
          }
        };
      } catch (error) {
        console.error('[FixV9] 在修补React DOM时出错:', error);
        return () => {};
      }
    }
    
    // 首先修补DOM API
    patchDOM();
    
    // 然后设置React DOM观察器和相关修复
    return patchReactDOM();
  }, []);

  // Error handling wrapper
  try {
    // Main logic
    useEffect(() => {
      // @ts-expect-error // TODO: Describe why this error is expected
      return mainEffectLogic();
    }, []);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    console.error('[FixV9] Component level error:', e);
  }
  
  return null;
}

// 全局类型声明
declare global {
  interface Window {
    _forceFixV9?: () => void;
  }
} 
 