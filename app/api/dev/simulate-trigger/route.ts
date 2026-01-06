// app/api/dev/simulate-trigger/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  /**
   * AlertTrigger model requires:
   * - alertId
   * - metal
   * - price
   */

  const trigger = await prisma.alertTrigger.create({
    data: {
      alertId: "dev",
      metal: "gold",
      price: 0,
    },
  });

  return NextResponse.json({
    ok: true,
    trigger,
  });
}
