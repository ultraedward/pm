import { NextResponse } from "next/server";
import { DATA_SOURCE, getMockPrices } from "@/lib/dataSource";

async function fetchLivePrices() {
  // Placeholder for real provider integration
  // Replace with Metals-API, Quandl, etc.
  return [];
}

export async function GET() {
  if (DATA_SOURCE === "mock") {
    return NextResponse.json({
      source: "mock",
      prices: getMockPrices(),
    });
  }

  const prices = await fetchLivePrices();

  return NextResponse.json({
    source: "live",
    prices,
  });
}
