import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const triggers = await prisma.alertTrigger.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, triggers });
  } catch (err) {
    console.warn("alertTrigger table not ready yet");
    return NextResponse.json({
      ok: true,
      triggers: [],
      skipped: true,
    });
  }
}
