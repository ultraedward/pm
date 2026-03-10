import { NextResponse } from "next/server";
import { updateMetalsPrices } from "@/lib/priceEngine";
import { prunePriceHistory } from "@/lib/prunePrices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prices = await updateMetalsPrices();

    let pruned = 0;

    // Run pruning only occasionally to save execution time
    if (Math.random() < 0.1) {
      const result = await prunePriceHistory();
      pruned = result.pruned;
    }

    return NextResponse.json({
      success: true,
      ...prices,
      pruned,
    });
  } catch (error) {
    console.error("Cron run failed:", error);

    return NextResponse.json(
      { error: "Cron run failed" },
      { status: 500 }
    );
  }
}