import { NextResponse } from "next/server";
import { updateMetalsPrices } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Require cron secret to prevent public triggering
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const prices = await updateMetalsPrices();
    return NextResponse.json({ success: true, ...prices });
  } catch (error) {
    console.error("Price update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
