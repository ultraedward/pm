import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that only exist for development / internal tooling.
// In production every one of these redirects to the homepage.
const BLOCKED_IN_PROD = [
  "/dev",
  "/debug",
  "/test",
  "/sim",
  "/live",
  "/history",
  "/notifications",
  "/system",
  "/email-logs",
  "/export",
  "/signin",          // duplicate of /login
  "/prices",          // raw dev price list
  "/dashboard/prices",
  "/dashboard/alerts/activity",
  "/dashboard/email-logs",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Maintenance mode — set MAINTENANCE_MODE=true in Vercel env vars to enable
  if (process.env.MAINTENANCE_MODE === "true") {
    if (
      pathname !== "/maintenance" &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api/") &&
      !pathname.match(/\.(ico|png|jpg|svg|webp)$/)
    ) {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }
  }

  if (process.env.NODE_ENV === "production") {
    for (const path of BLOCKED_IN_PROD) {
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
