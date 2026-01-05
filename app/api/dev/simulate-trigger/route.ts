// app/api/dev/simulate-trigger/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const user = await prisma.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  const alert = await prisma.alert.findFirst({
    where: { userId: user.id },
  });

  if (!alert) {
    return NextResponse.json({ error: "No alert found" }, { status: 404 });
  }

  const trigger = await prisma.alertTrigger.create({
    data: {
      // ✅ use relations, not raw IDs
      user: {
        connect: { id: user.id },
      },
      alert: {
        connect: { id: alert.id },
      },

      // ✅ only real scalar fields
      price: alert.threshold,
      triggered: true,
    },
  });

  return NextResponse.json({
    success: true,
    trigger,
  });
}
