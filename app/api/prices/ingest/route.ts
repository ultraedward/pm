import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { metal, price } = await req.json();

  const record = await prisma.spotPriceCache.create({
    data: {
      metal,
      price,
      source: "manual",
    },
  });

  return NextResponse.json(record);
}
