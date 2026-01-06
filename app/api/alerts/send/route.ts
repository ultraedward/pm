// app/api/alerts/send/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  // 🔴 IMPORTANT:
  // Your EmailLog model does NOT have a `user` relation.
  // It only supports scalar fields (to, subject, status, etc).

  await prisma.emailLog.create({
    data: {
      to: "test@example.com",
      subject: "Test Alert",
      status: "sent",
    },
  });

  return NextResponse.json({ ok: true });
}
