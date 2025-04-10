'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TranslatedText from '@/components/TranslatedText';

export default function BlogAdminPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  }>({});

  // 处理删除所有博客文章
  const handleDeleteAllPosts = async () => {
    if (!adminKey) {
      setResult({
        success: false,
        error: '请输入管理员密钥'
      });
      return;
    }

    if (!confirm('警告: 这将删除所有博客文章。此操作无法撤销。确定要继续吗?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setResult({});

      const response = await fetch('/api/blog/delete-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || '删除文章时出错'
        });
        return;
      }

      setResult({
        success: true,
        message: data.message || '成功删除所有博客文章'
      });

      // 刷新页面数据
      router.refresh();
    } catch (error) {
      setResult({
        success: false,
        error: '处理请求时发生错误'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 手动触发博客生成
  const handleGenerateBlogPost = async () => {
    if (!adminKey) {
      setResult({
        success: false,
        error: '请输入管理员密钥'
      });
      return;
    }

    try {
      setIsDeleting(true);
      setResult({});

      const response = await fetch('/api/blog/cron', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || '生成博客文章时出错'
        });
        return;
      }

      setResult({
        success: true,
        message: '成功生成新的博客文章'
      });

      // 刷新页面数据
      router.refresh();
    } catch (error) {
      setResult({
        success: false,
        error: '处理请求时发生错误'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">博客管理</h1>
          
          {/* 面包屑导航 */}
          <nav className="mb-8">
            <ol className="flex text-sm text-gray-500">
              <li className="flex items-center">
                <Link href={`/${lang}`} className="hover:text-gray-700">
                  <TranslatedText translationKey="breadcrumb.home" fallback="首页" />
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="flex items-center">
                <Link href={`/${lang}/admin`} className="hover:text-gray-700">
                  管理员
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="font-medium text-gray-700">
                博客管理
              </li>
            </ol>
          </nav>
          
          {/* 管理员密钥 */}
          <div className="mb-8">
            <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-2">
              管理员密钥
            </label>
            <input
              type="password"
              id="adminKey"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="输入管理员密钥"
            />
          </div>
          
          {/* 操作按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h2 className="text-lg font-medium text-red-800 mb-3">危险区域</h2>
              <p className="text-sm text-red-600 mb-4">
                以下操作不可撤销，请谨慎执行。
              </p>
              <button
                onClick={handleDeleteAllPosts}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? '正在处理...' : '删除所有博客文章'}
              </button>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-lg font-medium text-blue-800 mb-3">内容生成</h2>
              <p className="text-sm text-blue-600 mb-4">
                手动触发博客文章生成。
              </p>
              <button
                onClick={handleGenerateBlogPost}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isDeleting ? '正在处理...' : '生成新博客文章'}
              </button>
            </div>
          </div>
          
          {/* 结果显示 */}
          {(result.message || result.error) && (
            <div className={`p-4 rounded-md mb-6 ${
              result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? '操作成功' : '操作失败'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>{result.message || result.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 操作说明 */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">说明</h3>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>删除所有博客文章操作不可撤销，请确保您理解此操作的后果。</li>
              <li>删除后，您可以通过点击"生成新博客文章"按钮来创建新的优化文章。</li>
              <li>博客文章也会通过自动化Cron任务每天定时生成。</li>
              <li>管理员密钥是对API操作的一层简单保护，请勿在公共场所输入。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 