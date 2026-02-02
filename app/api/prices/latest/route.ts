import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "metal_required" },
      { status: 400 }
    );
  }

  const latest = await prisma.priceHistory.findFirst({
    where: {
      metal,
      price: {
        gt: 10, // 🔒 ignore garbage rows
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latest) {
    return NextResponse.json([]);
  }

  return NextResponse.json(latest);
}