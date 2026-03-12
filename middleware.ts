import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEV_ONLY_PATHS = ["/dev", "/debug", "/test", "/sim"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block dev/debug routes in production
  if (process.env.NODE_ENV === "production") {
    for (const path of DEV_ONLY_PATHS) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
