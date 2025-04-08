'use client';

import { useTranslation } from '@/lib/i18n/context';
import { useEffect, useState } from 'react';

interface TranslatedTextProps {
  translationKey: string;
  fallback?: string;
  lang?: string;
  showLoading?: boolean; // 是否在加载时显示加载指示器
}

export default function TranslatedText({ 
  translationKey, 
  fallback = translationKey.split('.').pop() || translationKey,
  lang,
  showLoading = false, // 默认不显示加载指示器
}: TranslatedTextProps) {
  const { getTranslation, isLoading, language } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  // 使用useEffect确保组件仅在客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 使用提供的lang或来自context的全局语言
  const activeLang = lang || language;
  
  // 从context获取翻译
  const translatedText = getTranslation(translationKey, fallback);
  
  // 在组件挂载前不渲染任何内容（避免服务器/客户端不匹配）
  if (!isMounted) {
    return null;
  }
  
  // 如果正在加载并启用了加载指示器
  if (isLoading && showLoading) {
    return <span className="text-gray-400 animate-pulse">{fallback}</span>;
  }
  
  // 显示翻译文本或回退值
  return <>{translatedText}</>;
}

// 用于清除翻译缓存的函数
export function clearTranslationCache() {
  if (typeof window === 'undefined') return;
  
  try {
    // 从localStorage中查找并删除所有翻译缓存
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('translations_')) {
        localStorage.removeItem(key);
        console.log(`Cleared translation cache: ${key}`);
      }
    });
    
    // 强制刷新页面以重新加载翻译
    window.location.reload();
  } catch (error) {
    console.error('Error clearing translation cache:', error);
  }
} 