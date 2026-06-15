/**
 * Annual tax snapshot — runs on Jan 1 via the daily price-update cron.
 * Emails all Pro users their Dec 31 portfolio value, cost basis, and
 * gain/loss per metal. Uses the last stored price before Jan 1 midnight UTC.
 */

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { hasProAccess } from "@/lib/entitlements";
import { buildTaxSnapshotHtml, type TaxHoldingRow } from "@/lib/email/taxSnapshotEmail";

export async function runTaxSnapshot(): Promise<{ sent: number; skipped: number }> {
  const now = new Date();
  const isJanFirst = now.getUTCMonth() === 0 && now.getUTCDate() === 1;
  if (!isJanFirst) return { sent: 0, skipped: 0 };
  if (!process.env.RESEND_API_KEY) return { sent: 0, skipped: 0 };

  const taxYear = now.getUTCFullYear() - 1;
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://lode.rocks";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

  // Dec 31 closing prices — last stored row before Jan 1 00:00 UTC
  const jan1Start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0));
  const dec31Prices = await Promise.all(
    ["gold", "silver", "platinum", "palladium"].map((metal) =>
      prisma.price.findFirst({
        where: { metal, timestamp: { lt: jan1Start } },
        orderBy: { timestamp: "desc" },
        select: { price: true, metal: true },
      })
    )
  );

  const spotMap: Record<string, number> = {};
  for (const row of dec31Prices) {
    if (row) spotMap[row.metal] = row.price;
  }

  // All Pro users who have at least one holding
  const proUsers = await prisma.user.findMany({
    where: {
      holdings: { some: {} },
      OR: [
        { subscriptionStatus: "active" },
        { subscriptionStatus: "trialing" },
        { proUntil: { gt: now } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      subscriptionStatus: true,
      proUntil: true,
      preferredCurrency: true,
      holdings: true,
    },
  });

  let sent = 0;
  let skipped = 0;

  for (const user of proUsers) {
    if (!hasProAccess({ stripeStatus: user.subscriptionStatus, proUntil: user.proUntil })) {
      skipped++;
      continue;
    }
    if (!user.email) { skipped++; continue; }

    const currency = user.preferredCurrency ?? "USD";
    const holdingRows: TaxHoldingRow[] = [];
    let totalCostBasis = 0;
    let totalValue = 0;

    for (const h of user.holdings) {
      const spot = spotMap[h.metal] ?? Number(h.purchasePrice);
      const ounces = Number(h.ounces);
      const costBasis = ounces * Number(h.purchasePrice);
      const currentValue = ounces * spot;
      const gainLoss = currentValue - costBasis;
      totalCostBasis += costBasis;
      totalValue += currentValue;
      holdingRows.push({
        metal: h.metal,
        ounces,
        costBasis,
        spotPrice: spot,
        currentValue,
        gainLoss,
        gainPct: costBasis > 0 ? (gainLoss / costBasis) * 100 : 0,
      });
    }

    const html = buildTaxSnapshotHtml({
      firstName: user.name?.split(" ")[0] ?? "",
      year: taxYear,
      holdings: holdingRows,
      totalCostBasis,
      totalValue,
      totalGainLoss: totalValue - totalCostBasis,
      currency,
      baseUrl,
    });

    try {
      await resend.emails.send({
        from,
        to: user.email,
        subject: `Your ${taxYear} precious metals snapshot — Lode`,
        html,
      });
      sent++;
    } catch (err) {
      console.error(`Tax snapshot failed for ${user.email}:`, err);
      skipped++;
    }
  }

  return { sent, skipped };
}
