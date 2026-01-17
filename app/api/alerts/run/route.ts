import { NextRequest, NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

function isAuthorizedBySecret(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  return secret === process.env.CRON_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedBySecret(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const result = await runAlertEngine();

  return NextResponse.json(
    { ok: true, result },
    { status: 200 }
  );
}
