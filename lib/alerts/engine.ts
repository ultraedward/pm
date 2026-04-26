import { prisma } from "@/lib/prisma";
import { queueEmail } from "@/lib/emailQueue";
import { getLivePrices } from "@/lib/prices";
import {
  findCheapest,
  defaultCoinForMetal,
  renderCheapestBlock,
  renderAffiliateDisclosure,
} from "@/lib/compare/cheapestPick";

/**
 * Evaluate a single alert against the current market price.
 * `currentPrice` must be the live spot price, NOT the alert target.
 */
export async function evaluateAlert(alertId: string, currentPrice: number) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: {
      user: true,
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
    },
  });

  if (!alert || !alert.active) return { triggered: false };

  // Null-safety: can't send email without an address
  if (!alert.user?.email) {
    console.warn(`Alert ${alertId}: user has no email, skipping`);
    return { triggered: false };
  }

  const conditionMet =
    (alert.direction === "above" && currentPrice >= alert.price) ||
    (alert.direction === "below" && currentPrice <= alert.price);

  if (!conditionMet) return { triggered: false };

  // Dedup guard: skip if this alert already fired in the last 23 hours
  // (prevents duplicate emails from clock skew or double cron runs)
  const recentTrigger = alert.triggers[0];
  if (recentTrigger) {
    const hoursSince =
      (Date.now() - new Date(recentTrigger.triggeredAt).getTime()) / 1000 / 3600;
    if (hoursSince < 23) return { triggered: false };
  }

  const metal = alert.metal.charAt(0).toUpperCase() + alert.metal.slice(1);
  const direction = alert.direction === "above" ? "risen above" : "fallen below";

  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      price: currentPrice,
      triggeredAt: new Date(),
    },
  });

  // The alert email is the highest-intent moment in the entire product —
  // a price the user has been waiting for just hit. When we have a coin
  // in the /compare catalog for this metal (currently gold and silver),
  // attach a "cheapest right now" CTA so the user can act on the signal
  // without having to navigate to /compare separately. For platinum and
  // palladium we omit the block (no coin in catalog) — the alert still
  // sends, just without the affiliate CTA.
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://lode.rocks";
  const compareCoinId = defaultCoinForMetal(alert.metal);
  const cheapest = compareCoinId
    ? findCheapest(compareCoinId, currentPrice, baseUrl, "alert-email")
    : null;

  const cheapestHtml = cheapest ? renderCheapestBlock(cheapest) : "";
  const disclosureHtml = cheapest ? renderAffiliateDisclosure() : "";
  // When the cheapest CTA is present, the dashboard CTA becomes secondary
  // (outline) so the gold "Buy at..." button is the visual primary action.
  // When there's no cheapest block (pt/pd alerts), the dashboard CTA stays
  // primary (filled gold) — its original style.
  const dashboardCtaStyle = cheapest
    ? "background:transparent;color:#D4AF37;border:1px solid rgba(212,175,55,0.4);"
    : "background:#D4AF37;color:#000;";

  await queueEmail({
    alertId: alert.id,
    to: alert.user.email,
    subject: `${metal} alert triggered — $${currentPrice.toLocaleString()}`,
    html: `
      <div style="font-family:sans-serif;padding:24px;background:#0a0907;color:#fff;max-width:480px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#D4AF37;margin:0 0 16px;">Lode</p>
        <h2 style="margin:0 0 16px;font-size:20px;">${metal} Alert Triggered</h2>
        <p style="color:#aaa;margin:0 0 20px;">The spot price has ${direction} your target of <strong style="color:#fff;">$${alert.price?.toLocaleString()}</strong>.</p>
        <div style="background:#111;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;">Current price: <strong>$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
        </div>
        ${cheapestHtml}
        <a href="${baseUrl}/dashboard"
           style="display:inline-block;padding:12px 20px;${dashboardCtaStyle}font-weight:700;text-decoration:none;border-radius:999px;font-size:13px;margin-top:${cheapest ? "8px" : "0"};">
          View Dashboard
        </a>
        ${disclosureHtml}
        <p style="margin-top:32px;font-size:11px;color:#555;">
          You're receiving this because you set a price alert on lode.rocks.
        </p>
      </div>
    `,
  });

  return { triggered: true };
}

/**
 * Batch alert engine — called by cron job.
 * Fetches the latest spot price per metal once, then evaluates
 * all active alerts against those prices.
 */
export async function runAlertEngine() {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
    include: { user: true },
  });

  if (alerts.length === 0) return;

  // Prefer live spot prices for accurate alert evaluation.
  // The in-memory cache in getLivePrices() means this is cheap when called
  // right after updateMetalsPrices() in the same cron run.
  // Falls back to the latest DB snapshot only if the live fetch fails entirely.
  const priceMap: Record<string, number> = {};

  try {
    const live = await getLivePrices();
    priceMap.gold      = live.Gold;
    priceMap.silver    = live.Silver;
    priceMap.platinum  = live.Platinum;
    priceMap.palladium = live.Palladium;
  } catch {
    // Live fetch failed — fall back to latest DB prices per metal
    console.warn("[alert engine] Live price fetch failed, falling back to DB prices");
    const metals = [...new Set(alerts.map((a) => a.metal))];
    const dbPrices = await Promise.all(
      metals.map((metal) =>
        prisma.price.findFirst({
          where: { metal },
          orderBy: { timestamp: "desc" },
          select: { metal: true, price: true },
        })
      )
    );
    for (const row of dbPrices) {
      if (row) priceMap[row.metal] = row.price;
    }
  }

  for (const alert of alerts) {
    const currentPrice = priceMap[alert.metal];
    if (currentPrice === undefined) continue;
    await evaluateAlert(alert.id, currentPrice);
  }
}
