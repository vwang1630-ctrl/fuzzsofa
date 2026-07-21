import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 产品 slug 列表
const PRODUCT_SLUGS = [
  'gorilla-sofa',
  'owl-sofa',
  'silverback-sofa',
  'meteorite-ring-sofa',
  'muscle-gorilla-sofa',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 如果已经是手机端路由或管理后台路由，直接放行
  if (pathname.startsWith('/m/') || pathname === '/m' || pathname.startsWith('/admin')) {
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
    let mobilePath = '';
    
    // 产品详情页：/[slug] -> /m/product/[slug]
    if (PRODUCT_SLUGS.includes(pathname.slice(1))) {
      mobilePath = `/m/product${pathname}`;
    } 
    // 首页
    else if (pathname === '/') {
      mobilePath = '/m';
    }
    // 其他路由：/[path] -> /m/[path]
    else {
      mobilePath = `/m${pathname}`;
    }
    
    const mobileUrl = new URL(mobilePath, request.url);
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
