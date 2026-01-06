import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  /**
   * IMPORTANT:
   * This cron route must NEVER assume optional models exist.
   * If spot price storage is not enabled yet, we exit safely.
   */

  const clientModels = Object.keys(prisma);

  if (!clientModels.includes("spotPriceCache")) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "spotPriceCache model not available",
      timestamp: new Date().toISOString(),
    });
  }

  // If the model exists in the future, this code can be enabled
  // without breaking production builds.
  //
  // const latest = await prisma.spotPriceCache.findFirst({...})

  return NextResponse.json({
    ok: true,
    checked: 0,
    triggered: 0,
    message: "Alert check skipped safely",
    timestamp: new Date().toISOString(),
  });
}
