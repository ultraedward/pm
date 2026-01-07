import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { metal, price } = await req.json();

  if (!metal || typeof price !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const record = await prisma.spotPriceCache.create({
    data: { metal, price },
  });

  return NextResponse.json({ ok: true, record });
}
