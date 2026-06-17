// lvyz.org 全站统一认证中间件 (Next.js 15 middleware convention)
// 自动拦截需要登录的路由
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/blog/new",
  "/blog/edit",
  "/admin",
];

// 知识库白名单保护（仅白名单邮箱可访问）
const WIKI_PATH = "/knowledge-base";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 受保护的路由：未登录跳转到登录页
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const sessionToken = request.cookies.get("lvyz.session_token")?.value;
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 知识库：未登录跳登录，已登录放过（白名单检查放在服务端页面 / api/wiki/access）
  if (pathname.startsWith(WIKI_PATH)) {
    const sessionToken = request.cookies.get("lvyz.session_token")?.value;
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路由除了：
     * - api 路由
     * - 静态资源
     * - _next
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
