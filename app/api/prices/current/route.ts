// app/api/prices/current/route.ts
import { NextResponse } from "next/server";
import { getCurrentPrices } from "@/app/lib/priceSource";

export async function GET() {
  const data = await getCurrentPrices();
  return NextResponse.json(data);
}
