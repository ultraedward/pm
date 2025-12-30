import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // ✅ Always allow Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const auth = req.cookies.get("pm_auth")?.value;

  if (!auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
