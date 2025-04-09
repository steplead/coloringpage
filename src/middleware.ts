import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和API路由
  if (
    pathname.includes('.') || // 静态文件
    pathname.startsWith('/_next/') || // Next.js内部路由
    pathname.startsWith('/api/') // API路由
  ) {
    return NextResponse.next();
  }

  // 检查路径是否已经包含语言代码
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // 创建新的URL对象
    const url = new URL(request.url);
    url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    
    // 使用临时重定向 307，这样搜索引擎不会缓存重定向
    return NextResponse.redirect(url, { status: 307 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，但排除：
     * 1. 所有带扩展名的文件
     * 2. Next.js内部路由
     * 3. API路由
     */
    '/((?!_next/|api/).*)'
  ]
}; 