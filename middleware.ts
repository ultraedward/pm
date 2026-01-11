import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ ALWAYS ALLOW THESE (NO AUTH, NO REDIRECTS)
  if (
    pathname.startsWith("/api/prices") ||
    pathname.startsWith("/api/dashboard") ||
    pathname.startsWith("/api/cron")
  ) {
    return NextResponse.next()
  }

  // ✅ Allow Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  // 🔒 Everything else behaves normally (auth, redirects, etc.)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
