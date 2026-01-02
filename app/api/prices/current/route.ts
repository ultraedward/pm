import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json({ error: "Metal required" }, { status: 400 });
  }

  const rows = await prisma.priceHistory.findMany({
    where: { metal },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  if (rows.length === 0) {
    return NextResponse.json({ metal, price: null, change: null });
  }

  const latest = rows[0];
  const previous = rows[1];

  const change =
    previous && previous.price !== 0
      ? ((latest.price - previous.price) / previous.price) * 100
      : 0;

  return NextResponse.json({
    metal,
    price: latest.price,
    change,
    updatedAt: latest.createdAt,
  });
}
