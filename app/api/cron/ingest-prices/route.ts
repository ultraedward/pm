import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

const LOCK_ID = 900001; // any stable int (document it)

export async function GET() {
  const { ran } = await withCronLock(LOCK_ID, async () => {
    // ---- CRON LOGIC START ----

    const metals = await prisma.metal.findMany();

    for (const metal of metals) {
      const price = Math.random() * 100 + 1000; // replace with real feed

      await prisma.priceHistory.create({
        data: {
          metalId: metal.id,
          price,
        },
      });
    }

    // ---- CRON LOGIC END ----
  });

  return NextResponse.json({
    ok: true,
    ran,
    message: ran ? "Cron executed" : "Skipped (lock held)",
  });
}