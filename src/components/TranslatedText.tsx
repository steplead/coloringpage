'use client';

import React, { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n/context';

// 针对中文的硬编码翻译，用于加快显示速度
const CHINESE_HARDCODED: Record<string, string> = {
  'features.title': '为什么选择我们的AI涂色页生成器？',
  'features.fast.title': '即时创建',
  'features.fast.desc': '几秒钟内获得您的涂色页',
  'features.styles.title': '多种风格',
  'features.styles.desc': '简单的适合幼儿，复杂的适合成人',
  'features.everywhere.title': '随处可用',
  'features.everywhere.desc': '在手机、平板或电脑上使用',
  'features.unlimited.title': '无限页面',
  'features.unlimited.desc': '随时创建任意数量的页面',
  'features.print.title': '打印就绪',
  'features.print.desc': '适合任何尺寸打印的完美质量',
  'features.easy.title': '儿童友好',
  'features.easy.desc': '简单到孩子们可以自己使用',
  'features.secure.title': '安全私密',
  'features.secure.desc': '无需账户，您的创作属于您',
  'features.control.title': '完全控制',
  'features.control.desc': '根据您的喜好调整每个细节'
};

// 清除翻译缓存的函数
export function clearTranslationCache() {
  if (typeof window !== 'undefined') {
    // Clear all translation-related localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('translation_')) {
        localStorage.removeItem(key);
      }
    }
    console.log('Translation cache cleared');
  }
}

type TranslatedTextProps = {
  translationKey: string;
  fallback?: string;
  params?: Record<string, string>;
  className?: string;
};

export default function TranslatedText({ 
  translationKey, 
  fallback = '', 
  params = {}, 
  className = '' 
}: TranslatedTextProps) {
  const { translations, language, isLoading, lastError } = useTranslation();
  
  // Replace placeholders like {{param}} with actual values
  const formatTranslation = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
  };

  if (isLoading) {
    // Return a skeleton loader with similar dimensions
    return (
      <span className={`bg-gray-200 animate-pulse rounded ${className}`} 
            style={{ display: 'inline-block', minWidth: '20px', height: '1em' }}>
        {fallback || '-'}
      </span>
    );
  }

  if (lastError) {
    console.error('Translation error:', lastError);
    return <span className={className}>{fallback || translationKey}</span>;
  }

  // Navigate through the translation object using the dot notation key
  let parts = translationKey.split('.');
  let result = translations;
  
  for (const part of parts) {
    result = result?.[part];
    if (result === undefined) break;
  }

  // If we found a string translation, format it with params
  if (typeof result === 'string') {
    return <span className={className}>{formatTranslation(result)}</span>;
  }
  
  // Otherwise use fallback
  return <span className={className}>{fallback || translationKey}</span>;
} 