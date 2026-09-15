import { auth } from "@/app/lib/auth";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = auth((req) => handleI18nRouting(req));

export default function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api") || req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)"],
};