// middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * IMPORTANT:
 * - DO NOT protect dashboard data APIs
 * - Charts must load without auth middleware
 */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 🔑 allow these paths ALWAYS
  if (
    pathname.startsWith("/api/dashboard") ||
    pathname.startsWith("/api/prices") ||
    pathname.startsWith("/api/cron")
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
