import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all routes EXCEPT:
      - Next.js internals
      - static files
      - auth routes
      - api routes
    */
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api).*)",
  ],
};