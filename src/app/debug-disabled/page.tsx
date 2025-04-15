'use client';

import { useTranslation } from '@/lib/i18n/context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TranslatedText from '@/components/TranslatedText';
import { clearTranslationCache } from '@/components/TranslatedText';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export default function DebugPage() {
  const { language, translations, setLanguage, isLoading, lastError, refreshTranslations } = useTranslation();
  const [storageKeys, setStorageKeys] = useState<string[]>([]);
  const [storageData, setStorageData] = useState<Record<string, unknown>>({});
  
  // 获取localStorage中的所有翻译相关键
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keys: string[] = [];
      const data: Record<string, unknown> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('translation')) {
          keys.push(key);
          try {
            data[key] = JSON.parse(localStorage.getItem(key) || '{}');
          } catch {
            data[key] = localStorage.getItem(key);
          }
        }
      }
      
      setStorageKeys(keys);
      setStorageData(data);
    }
  }, [language, isLoading]);
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">翻译系统调试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">当前翻译状态</h2>
          <div className="space-y-2">
            <p><strong>当前语言:</strong> {language}</p>
            <p><strong>加载中:</strong> {isLoading ? '是' : '否'}</p>
            <p><strong>上次错误:</strong> {lastError || '无'}</p>
            <p><strong>可用翻译:</strong> {Object.keys(translations || {}).length}</p>
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold">语言切换</h3>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`px-3 py-1 rounded ${language === lang.code ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.flag} {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold">操作</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => refreshTranslations()}
                className="px-3 py-1 rounded bg-blue-500 text-white"
              >
                刷新翻译
              </button>
              <button 
                onClick={() => {
                  clearTranslationCache();
                  window.location.reload();
                }}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                清除缓存并刷新
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">LocalStorage 缓存</h2>
          {storageKeys.length > 0 ? (
            <div className="space-y-3">
              {storageKeys.map(key => (
                <div key={key} className="border-b pb-2">
                  <p className="font-semibold break-all">{key}</p>
                  <p className="text-sm text-gray-500">大小: {JSON.stringify(storageData[key]).length} bytes</p>
                </div>
              ))}
            </div>
          ) : (
            <p>没有找到缓存的翻译</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3">翻译测试</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">常用翻译</h3>
            <div className="space-y-2">
              <p><strong>标题:</strong> <TranslatedText translationKey="home.hero.title" fallback="首页标题" /></p>
              <p><strong>副标题:</strong> <TranslatedText translationKey="home.hero.subtitle" fallback="首页副标题" /></p>
              <p><strong>按钮:</strong> <TranslatedText translationKey="home.hero.createButton" fallback="创建按钮" /></p>
              <p><strong>功能标题:</strong> <TranslatedText translationKey="home.features.title" fallback="功能标题" /></p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Features 部分</h3>
            <div className="space-y-2">
              <p><strong>快速:</strong> <TranslatedText translationKey="home.features.fast.title" fallback="快速标题" /> - <TranslatedText translationKey="home.features.fast.desc" fallback="快速描述" /></p>
              <p><strong>风格:</strong> <TranslatedText translationKey="home.features.styles.title" fallback="风格标题" /> - <TranslatedText translationKey="home.features.styles.desc" fallback="风格描述" /></p>
              <p><strong>随处:</strong> <TranslatedText translationKey="home.features.everywhere.title" fallback="随处标题" /> - <TranslatedText translationKey="home.features.everywhere.desc" fallback="随处描述" /></p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-x-3">
        <Link href="/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded">
          返回首页
        </Link>
        <Link href="/zh" className="inline-block px-4 py-2 bg-green-500 text-white rounded">
          中文首页
        </Link>
        <Link href="/en" className="inline-block px-4 py-2 bg-purple-500 text-white rounded">
          英文首页
        </Link>
      </div>
    </div>
  );
} 