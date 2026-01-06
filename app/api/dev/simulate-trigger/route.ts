// app/api/dev/simulate-trigger/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  /**
   * AlertTrigger model does NOT have `userId`
   * It only belongs to an Alert via `alertId`
   */

  const trigger = await prisma.alertTrigger.create({
    data: {
      alertId: "dev",
      price: 0,
    },
  });

  return NextResponse.json({ ok: true, trigger });
}
