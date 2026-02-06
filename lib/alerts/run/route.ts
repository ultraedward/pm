import { NextRequest, NextResponse } from "next/server";
import { evaluateAlert } from "@/lib/alerts/engine";

export async function POST(req: NextRequest) {
  const { alertId, price } = await req.json();

  if (!alertId || typeof price !== "number") {
    return NextResponse.json(
      { error: "alertId and price required" },
      { status: 400 }
    );
  }

  await evaluateAlert(alertId, price);

  return NextResponse.json({ ok: true });
}