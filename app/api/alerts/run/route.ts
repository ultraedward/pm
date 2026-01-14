// app/api/alerts/run/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { runAlertEngine } from "@/lib/alerts/engine";

export const dynamic = "force-dynamic";

function isAuthorizedBySecret(req: Request) {
  const secret = process.env.ALERT_RUN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-alert-run-secret");
  const qp = new URL(req.url).searchParams.get("secret");
  return header === secret || qp === secret;
}

/**
 * GET /api/alerts/run
 *
 * Intended for:
 * - Vercel Cron / external cron (send x-alert-run-secret)
 * - Manual debugging (requires being signed in)
 */
export async function GET(req: Request) {
  // 1) Allow cron secret
  if (isAuthorizedBySecret(req)) {
    const result = await runAlertEngine("cron");
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  // 2) Signed-in manual run
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await runAlertEngine("manual");
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

/**
 * POST /api/alerts/run
 * Same behavior as GET (useful for internal calls)
 */
export async function POST(req: Request) {
  return GET(req);
}
