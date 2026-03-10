import { NextResponse } from "next/server";
import { updateMetalsPrices } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prices = await updateMetalsPrices();

    return NextResponse.json({
      success: true,
      ...prices,
    });
  } catch (error) {
    console.error("Cron update failed:", error);

    return NextResponse.json(
      { error: "Cron update failed" },
      { status: 500 }
    );
  }
}