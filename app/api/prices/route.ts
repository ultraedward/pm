import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  // 🚨 TEMP STUB
  // Prisma has NO priceHistory model.
  // This endpoint must not touch Prisma until schema exists.

  const data = METALS.map((metal) => ({
    metal,
    prices: [],
  }));

  return NextResponse.json({
    ok: true,
    data,
  });
}