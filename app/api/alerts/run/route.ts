// app/api/alerts/run/route.ts
// FULL FILE — COPY / PASTE EVERYTHING

import { NextRequest, NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";
import { isAuthorizedBySecret } from "@/lib/auth/cron";

export async function POST(req: NextRequest) {
  // 1) Cron / secret
  if (isAuthorizedBySecret(req)) {
    const result = await runAlertEngine();

    return NextResponse.json(
      { ok: true, result },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 }
  );
}
