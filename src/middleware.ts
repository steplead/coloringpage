import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

// 静态资源和API路径
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = [
  '/api/',
  '/_next/',
  '/static/',
  '/images/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是静态文件或排除的路径
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // 检查路径是否已经包含语言代码
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果路径中没有语言代码，添加默认语言
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    
    // 创建新的URL对象
    const url = new URL(request.url);
    
    // 如果是根路径，直接添加语言代码
    if (pathname === '/') {
      url.pathname = `/${locale}`;
    } else {
      // 否则在路径前添加语言代码
      url.pathname = `/${locale}${pathname}`;
    }

    // 使用redirect而不是rewrite
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，除了静态文件和API路由
    '/((?!api/|_next/|static/|images/|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}; 