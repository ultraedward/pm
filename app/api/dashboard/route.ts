import { NextResponse } from "next/server";
import { getMockPrices } from "@/lib/dataSource";

export async function GET() {
  return NextResponse.json({
    source: "mock",
    prices: getMockPrices(),
  });
}
