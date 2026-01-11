// app/api/dashboard/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// FIX: remove non-existent `isPro` field

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const latestPrices = await prisma.spotPriceCache.findMany({
    distinct: ["metal"],
    orderBy: { createdAt: "desc" },
    select: {
      metal: true,
      price: true,
      createdAt: true,
    },
  });

  const alertsCount = await prisma.alert.count({
    where: { userId: user.id },
  });

  return NextResponse.json({
    ok: true,
    user,
    alertsCount,
    latestPrices,
  });
}
