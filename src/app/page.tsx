'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 在客户端添加重定向到默认语言页面的逻辑
    const defaultLocale = 'en'; // 或从localStorage/cookie读取上次访问的语言
    router.replace(`/${defaultLocale}`);
  }, [router]);
  
  // 显示一个基础的加载页面，直到重定向完成
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-middle"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
} 