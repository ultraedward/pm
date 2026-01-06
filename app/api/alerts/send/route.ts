import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const log = await prisma.emailLog.create({
    data: {
      to: "test@example.com",
      subject: "Test Alert",
      status: "sent",
    },
  });

  return NextResponse.json({
    ok: true,
    log,
  });
}
