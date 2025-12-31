import { NextResponse } from "next/server";
import { DATA_SOURCE, getMockPrices } from "@/lib/dataSource";

export async function GET() {
  if (DATA_SOURCE === "mock") {
    return NextResponse.json({
      source: "mock",
      prices: getMockPrices(),
    });
  }

  return NextResponse.json({
    source: "live",
    prices: [],
  });
}
