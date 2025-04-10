'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import get from 'lodash.get';

// 支持中文的硬编码翻译（以防语言切换中出现空白）
const hardcodedZh: Record<string, string> = {
  'common.appName': 'AI涂色页',
  'home.hero.title': '使用AI创建精美的涂色页',
  'home.hero.subtitle': '几秒钟内将您的想法转化为精美的涂色页。适合儿童、教师和涂色爱好者。',
  'home.hero.createButton': '立即创建',
  'nav.home': '主页',
  'nav.gallery': '画廊',
  'nav.about': '关于',
  'nav.create': '创建',
  'nav.createNow': '立即创建',
  'common.loading': '加载中...',
  'create.title': '创建您的涂色页',
  'create.subtitle': '选择下方的创建方式，让我们的AI为您生成精美的涂色页',
  // 使用方法部分的硬编码翻译
  'home.howItWorks.title': '使用方法',
  'home.methods.describe.title': '描述您想要的图像',
  'home.methods.describe.description': '输入文字描述，我们的AI将创建匹配的涂色页',
  'home.methods.style.title': '选择您喜欢的风格',
  'home.methods.style.description': '从多种艺术风格中选择，定制您的涂色页外观',
  'home.methods.advanced.title': '高级设置',
  'home.methods.advanced.description': '调整细节参数，获得完全符合您需求的涂色页'
};

// 导出清除翻译缓存的函数
export const clearTranslationCache = () => {
  if (typeof window !== 'undefined') {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('translations_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Translation cache cleared');
    window.location.reload();
  }
};

type TranslatedTextProps = {
  // 支持新旧两种属性
  translationKey?: string;
  path?: string;
  fallback?: string;
  params?: Record<string, string | number>;
  className?: string;
  skipLoading?: boolean;
};

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  translationKey, 
  path, 
  fallback = '', 
  params = {}, 
  className = '',
  skipLoading = false
}) => {
  const { translations, language, isLoading, lastError } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  // 使用translationKey或path，确保向后兼容性
  const key = translationKey || path;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!key) {
    console.error('TranslatedText: No translationKey or path provided');
    return <span className={className}>{fallback}</span>;
  }

  // 未挂载前，直接返回fallback，避免服务器/客户端渲染不一致
  if (!isMounted) {
    return <span className={className}>{fallback}</span>;
  }

  // 加载中显示骨架屏
  if (isMounted && isLoading && !skipLoading) {
    return (
      <span className={`inline-block bg-gray-200 animate-pulse rounded ${className}`} style={{ minWidth: '3em' }}>
        {fallback}
      </span>
    );
  }

  // 如果是中文且有硬编码翻译，直接使用
  if (language === 'zh' && key in hardcodedZh) {
    return <span className={className}>{hardcodedZh[key]}</span>;
  }

  // 当有翻译时使用翻译
  if (translations && Object.keys(translations).length > 0) {
    const translated = get(translations, key);
    
    if (translated) {
      // 处理包含参数的翻译
      let formattedText = translated;
      
      Object.entries(params).forEach(([paramKey, value]) => {
        formattedText = formattedText.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
      });
      
      return <span className={className}>{formattedText}</span>;
    }
  }

  // 如果翻译出错或没有找到翻译，使用fallback
  if (lastError) {
    console.warn(`Translation error for key ${key}:`, lastError);
  }

  return <span className={className}>{fallback}</span>;
};

export default TranslatedText;
