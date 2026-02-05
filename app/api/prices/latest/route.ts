import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "metal is required" },
      { status: 400 }
    );
  }

  // 🚨 TEMPORARY STUB
  // No Prisma-backed price history model exists.
  // This endpoint must not touch Prisma until schema is finalized.

  return NextResponse.json({
    metal,
    price: null,
    timestamp: null,
  });
}