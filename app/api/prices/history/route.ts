// app/api/prices/history/route.ts
import { NextResponse } from "next/server";
import { getPriceHistory } from "@/app/lib/priceSource";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 24);

  const history = await getPriceHistory(hours);

  return NextResponse.json({
    hours,
    count: history.length,
    data: history,
  });
}
