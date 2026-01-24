import { NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  try {
    const result = await runAlertEngine();

    return NextResponse.json({
      ok: true,
      checkedAlerts: result.checkedAlerts,
      newTriggers: result.triggered,
      ranAt: new Date().toISOString(),
      ms: Date.now() - started,
    });
  } catch (err) {
    console.error("Cron alert check failed", err);

    return NextResponse.json(
      {
        ok: false,
        error: "cron alert check failed",
        ranAt: new Date().toISOString(),
        ms: Date.now() - started,
      },
      { status: 500 }
    );
  }
}