// middleware.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      IMPORTANT:
      - NEVER touch /api/auth/*
      - NEVER touch /api/*
      - ONLY page routes
    */
    "/((?!api|_next|favicon.ico).*)",
  ],
};
