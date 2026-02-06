import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  const pending = await prisma.emailLog.findMany({
    where: {
      status: "pending",
      attempts: { lt: 5 },
    },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  for (const email of pending) {
    try {
      await sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.html,
      });

      await prisma.emailLog.update({
        where: { id: email.id },
        data: {
          status: "sent",
          attempts: email.attempts + 1,
        },
      });
    } catch (err) {
      await prisma.emailLog.update({
        where: { id: email.id },
        data: {
          status: "failed",
          attempts: email.attempts + 1,
        },
      });
    }
  }

  return NextResponse.json({ processed: pending.length });
}