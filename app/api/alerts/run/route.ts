import { NextResponse } from "next/server";
import { runAlertEngine } from "@/lib/alerts/engine";

export async function POST() {
  const result = await runAlertEngine(new Date());

  return NextResponse.json({
    ok: true,
    result,
  });
}
