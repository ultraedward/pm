// app/api/pro/ping/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// FIX: requirePro no longer returns NextResponse

import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Auth check only (pro gating disabled)
    await requirePro();

    return NextResponse.json({
      ok: true,
      proEnabled: false,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unauthorized" },
      { status: 401 }
    );
  }
}
