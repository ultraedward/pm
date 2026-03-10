import { NextResponse } from "next/server";
import { prunePriceHistory } from "@/lib/prunePrices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prunePriceHistory();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Prune failed:", error);

    return NextResponse.json(
      { error: "Prune failed" },
      { status: 500 }
    );
  }
}