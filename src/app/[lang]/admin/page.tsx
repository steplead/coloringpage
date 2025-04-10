import React from 'react';
import Link from 'next/link';
import TranslatedText from '@/components/TranslatedText';

export default function AdminPage({
  params: { lang }
}: {
  params: { lang: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">网站管理</h1>
          
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
              <li className="font-medium text-gray-700">
                管理员
              </li>
            </ol>
          </nav>
          
          {/* 管理员功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 博客管理 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h2 className="text-lg font-medium text-gray-900 mb-2">博客管理</h2>
              <p className="text-gray-600 text-sm mb-4">
                管理博客文章，生成新内容，删除旧文章。
              </p>
              <Link 
                href={`/${lang}/admin/blog`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                进入管理 →
              </Link>
            </div>
            
            {/* 网站设置卡片（如果需要可以添加更多功能卡片） */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-lg font-medium text-gray-400 mb-2">网站设置</h2>
              <p className="text-gray-500 text-sm mb-4">
                配置网站参数，更改全局设置。
              </p>
              <span className="text-gray-400 text-sm">即将推出</span>
            </div>
            
            {/* 统计分析卡片 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-lg font-medium text-gray-400 mb-2">统计分析</h2>
              <p className="text-gray-500 text-sm mb-4">
                查看网站访问数据和用户行为统计。
              </p>
              <span className="text-gray-400 text-sm">即将推出</span>
            </div>
          </div>
          
          {/* 操作说明 */}
          <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">管理员说明</h3>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>此管理界面仅供网站管理员使用，请勿将访问权限泄露给他人。</li>
              <li>执行敏感操作时需要输入管理员密钥，请妥善保管。</li>
              <li>部分数据修改操作不可撤销，请在操作前确认。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 