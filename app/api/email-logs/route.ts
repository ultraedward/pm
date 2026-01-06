import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, logs });
  } catch (err) {
    console.warn("EmailLog table not ready yet");
    return NextResponse.json({
      ok: true,
      logs: [],
      skipped: true,
    });
  }
}
