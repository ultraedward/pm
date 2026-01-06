import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { metal, price, source = "manual" } = body;

  if (!metal || typeof price !== "number") {
    return NextResponse.json(
      { error: "metal and numeric price required" },
      { status: 400 }
    );
  }

  const record = await prisma.spotPrice.create({
    data: {
      metal,
      price,
      source,
    },
  });

  return NextResponse.json({
    ok: true,
    record,
  });
}
