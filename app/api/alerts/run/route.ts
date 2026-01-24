import { NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
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
    console.error("Alert engine failed", err);

    return NextResponse.json(
      {
        ok: false,
        error: "alert engine failed",
        ranAt: new Date().toISOString(),
        ms: Date.now() - started,
      },
      { status: 500 }
    );
  }
}