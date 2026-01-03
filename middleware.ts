import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/cron")) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/cron/:path*"],
};
