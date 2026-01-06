import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await prisma.$queryRaw<
    {
      id: string;
      metal: string;
      price: number;
      createdAt: Date;
    }[]
  >`
    SELECT id, metal, price, "createdAt"
    FROM "SpotPriceCache"
    ORDER BY "createdAt" DESC
  `;

  return NextResponse.json({
    ok: true,
    prices,
  });
}
