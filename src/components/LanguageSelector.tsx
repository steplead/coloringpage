'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { clearTranslationCache } from './TranslatedText';
import { useTranslation } from '@/lib/i18n/context';

interface LanguageSelectorProps {
  currentLang?: string;
  align?: 'left' | 'right';
  className?: string;
}

export default function LanguageSelector({
  currentLang,
  align = 'right',
  className = '',
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLang || 'en');
  const { setLanguage, language, isLoading, refreshTranslations, lastError } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 切换下拉菜单
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 关闭下拉菜单
  const closeDropdown = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  
  // 监听点击事件关闭菜单
  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);
  
  // 同步内部状态和外部传入的语言
  useEffect(() => {
    if (currentLang) {
      setSelectedLanguage(currentLang);
    } else if (language) {
      setSelectedLanguage(language);
    }
  }, [currentLang, language]);
  
  // 获取当前语言
  const displayLang = currentLang || language || 'en';
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === displayLang);
  
  // 强制刷新翻译
  const handleForceRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    refreshTranslations();
  };
  
  // 清除翻译缓存
  const handleClearCache = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearTranslationCache();
  };
  
  // 更改语言
  const handleLanguageChange = async (langCode: string) => {
    if (langCode === selectedLanguage) {
      setIsOpen(false);
      return;
    }
    
    try {
      // 更新上下文中的语言
      await setLanguage(langCode);
      
      // 更新URL路径中的语言
      const pathSegments = pathname.split('/');
      const isLangPath = SUPPORTED_LANGUAGES.some(lang => pathSegments[1] === lang.code);
      
      let newPath = '';
      if (isLangPath) {
        // 替换现有语言部分
        pathSegments[1] = langCode;
        newPath = pathSegments.join('/');
      } else {
        // 添加新语言部分
        newPath = `/${langCode}${pathname}`;
      }
      
      // 导航到新路径
      router.push(newPath);
      
      // 更新选中的语言
      setSelectedLanguage(langCode);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      // 关闭下拉菜单
      setIsOpen(false);
    }
  };
  
  return (
    <div 
      className={`relative ${className}`}
      ref={dropdownRef}
    >
      <button
        className={`flex items-center justify-between px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 ${isLoading ? 'opacity-70' : ''}`}
        onClick={toggleDropdown}
        disabled={isLoading}
        title={lastError ? `Translation error: ${lastError}` : undefined}
      >
        <span className="mr-2">{currentLanguageInfo?.flag || '🌍'}</span>
        <span>{currentLanguageInfo?.nativeName || displayLang}</span>
        <span className="ml-2">▼</span>
      </button>
      
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[180px]`}>
          <div className="py-1 max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${lang.code === selectedLanguage ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <div className="flex items-center">
                  <span className="mr-3">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {lang.code === selectedLanguage && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-gray-200 py-1">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-700 flex items-center"
                onClick={handleForceRefresh}
              >
                <span className="mr-3">🔄</span>
                <span>刷新当前语言</span>
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-700 flex items-center"
                onClick={handleClearCache}
              >
                <span className="mr-3">🗑️</span>
                <span>清除缓存并刷新</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 