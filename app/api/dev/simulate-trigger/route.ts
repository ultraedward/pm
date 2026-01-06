import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const trigger = await prisma.alertTrigger.create({
    data: {
      alertId: "dev",
      userId: "dev",
      price: 0,
    },
  });

  return NextResponse.json({ trigger });
}
