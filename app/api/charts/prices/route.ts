import { NextResponse } from "next/server";
import { generateMockPrices, RangeKey } from "@/lib/mockPrices";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") || "24h") as RangeKey;

  const data = generateMockPrices(range);

  return NextResponse.json({ range, data });
}
