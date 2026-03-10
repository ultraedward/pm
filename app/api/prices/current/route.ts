import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateMetalsPrices } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const latest = await prisma.price.findMany({
    orderBy: { timestamp: "desc" },
    take: 2
  });

  let gold = latest.find(p => p.metal === "gold");
  let silver = latest.find(p => p.metal === "silver");

  const now = Date.now();

  if (
    !gold ||
    !silver ||
    now - new Date(gold.timestamp).getTime() > 5 * 60 * 1000
  ) {
    const updated = await updateMetalsPrices();

    gold = { price: updated.gold };
    silver = { price: updated.silver };
  }

  return NextResponse.json({
    gold: gold.price,
    silver: silver.price
  });
}