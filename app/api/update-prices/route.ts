import { NextResponse } from "next/server";
import { updateMetalsPrices } from "@/lib/priceEngine";
import { runAlertEngine } from "@/lib/alerts/engine";
import { evaluatePredictions } from "@/lib/predictions/evaluate";
import { runOnboardingNudges } from "@/lib/onboarding/nudges";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Require cron secret to prevent public triggering
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const prices = await updateMetalsPrices();

    // Run alert engine + evaluate predictions after every price update
    await runAlertEngine();
    await evaluatePredictions();

    // Send day-3 and day-7 onboarding nudges to inactive new users
    const nudges = await runOnboardingNudges();

    return NextResponse.json({ success: true, ...prices, nudges });
  } catch (error) {
    console.error("Price update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
