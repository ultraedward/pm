import { NextResponse } from "next/server";
import { getCachedPrices } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prices = await getCachedPrices();

    return NextResponse.json({
      success: true,
      ...prices,
    });
  } catch (error) {
    console.error("Failed to fetch prices:", error);

    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}