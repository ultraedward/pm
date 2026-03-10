import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMetalsPrices } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gold = await prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    });

    const silver = await prisma.price.findFirst({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
    });

    const lastUpdate = gold?.timestamp?.getTime() || 0;
    const now = Date.now();

    // refresh if older than 5 minutes
    if (now - lastUpdate > 5 * 60 * 1000) {
      await updateMetalsPrices();
    }

    const latestGold = await prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    });

    const latestSilver = await prisma.price.findFirst({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({
      success: true,
      gold: latestGold?.price ?? 0,
      silver: latestSilver?.price ?? 0,
    });
  } catch (error) {
    console.error("Price fetch failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}