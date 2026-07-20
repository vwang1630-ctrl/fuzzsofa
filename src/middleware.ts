import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果已经是手机端路由，直接放行
  if (pathname.startsWith('/m/') || pathname === '/m') {
    return NextResponse.next();
  }
  
  // 如果是 API 路由或静态资源，直接放行
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // 检测设备类型
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  
  // 检查是否有桌面版偏好 cookie
  const preferDesktop = request.cookies.get('prefer-desktop')?.value === 'true';
  
  // 如果是手机端设备且没有桌面版偏好，重定向到手机端版本
  if (isMobile && !preferDesktop) {
    const mobileUrl = new URL(`/m${pathname}`, request.url);
    mobileUrl.search = request.nextUrl.search;
    return NextResponse.redirect(mobileUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
