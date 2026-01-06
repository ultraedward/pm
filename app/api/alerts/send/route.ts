import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  await prisma.emailLog.create({
    data: {
      to: "test@example.com",
      subject: "Test Alert",
      body: "Alert fired",
      status: "sent",
    },
  });

  return NextResponse.json({ ok: true });
}
