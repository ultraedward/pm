import { NextResponse } from "next/server";
import { generateMockPrices } from "@/lib/mockPrices";

export async function GET() {
  return NextResponse.json({
    gold: generateMockPrices("gold"),
    silver: generateMockPrices("silver"),
    platinum: generateMockPrices("platinum"),
  });
}
