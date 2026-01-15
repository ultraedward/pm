// app/api/alerts/run/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

export const dynamic = "force-dynamic";

function isAuthorizedBySecret(req: Request) {
  const secret = process.env.ALERT_RUN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-alert-run-secret");
  const qp = new URL(req.url).searchParams.get("secret");
  return header === secret || qp === secret;
}

function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  return origin.includes(host);
}

/**
 * GET / POST /api/alerts/run
 *
 * Allowed:
 * - Cron (x-alert-run-secret)
 * - Same-origin UI calls (manual run button)
 */
export async function GET(req: Request) {
  // 1) Cron / secret
  if (isAuthorizedBySecret(req)) {
    const result = await runAlertEngine("cron");
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  // 2) Same-origin manual run
  if (isSameOrigin(req)) {
    const result = await runAlertEngine("manual");
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 }
  );
}

export async function POST(req: Request) {
  return GET(req);
}
