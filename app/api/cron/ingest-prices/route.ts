import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

const LOCK_ID = 900001;

// ✅ Source of truth for supported metals
const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  const { ran } = await withCronLock(LOCK_ID, async () => {
    for (const metal of METALS) {
      // TODO: replace with real price feed
      const price = Math.random() * 100 + 1000;

      await prisma.priceHistory.create({
        data: {
          metal,
          price,
        },
      });
    }
  });

  return NextResponse.json({
    ok: true,
    ran,
    message: ran ? "Prices ingested" : "Skipped (lock held)",
  });
}