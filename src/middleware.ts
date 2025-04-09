import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 简化：只处理根路由重定向
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 只处理根路由
  if (pathname === '/') {
    const url = new URL(request.url);
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 简化：只匹配根路由
export const config = {
  matcher: '/'
}; 