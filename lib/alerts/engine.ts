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
  const metalColor: Record<string, string> = {
    gold: "#D4AF37", silver: "#C0C0C0", platinum: "#E5E4E2", palladium: "#9FA8C7",
  };
  const dot = metalColor[alert.metal] ?? "#D4AF37";

  // Human-readable direction phrase: "crossed above" / "dropped below"
  const directionPhrase = alert.direction === "above" ? "crossed above" : "dropped below";

  // % delta between current price and the target — gives the user instant context
  const targetPrice = alert.price ?? 0;
  const deltaPct = targetPrice > 0
    ? ((currentPrice - targetPrice) / targetPrice) * 100
    : null;
  const deltaStr = deltaPct !== null
    ? `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}% from target`
    : null;

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
  // (outline) so the "Buy now" button is the visual primary action.
  // When there's no cheapest block (pt/pd alerts), the dashboard CTA stays
  // primary (filled gold).
  const dashboardCtaStyle = cheapest
    ? "background:transparent;color:#D4AF37;border:1px solid rgba(212,175,55,0.4);"
    : "background:#D4AF37;color:#000;";

  // Subject: feels like breaking news, not a system log
  const priceDisplay = `$${Math.round(currentPrice).toLocaleString()}`;
  const subject = `${metal} just hit ${priceDisplay} — your alert fired`;

  // Preheader: inbox preview snippet (hidden from rendered email)
  const preheader = `Spot ${directionPhrase} your target of $${targetPrice.toLocaleString()}. ${deltaStr ?? ""}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- Preheader — hidden inbox preview text -->
  <div style="display:none;max-height:0;overflow:hidden;color:#0a0907;">${preheader}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Lode</p>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${dot};margin-right:6px;vertical-align:middle;"></span>
                <span style="color:#666;vertical-align:middle;">${metal} · Price Alert</span>
              </p>
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.02em;">
                ${metal} hit ${priceDisplay}.
              </h1>
              <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
                Spot ${directionPhrase} your target of <span style="color:#fff;font-weight:700;">$${targetPrice.toLocaleString()}</span>.
              </p>
            </td>
          </tr>

          <!-- Price tile -->
          <tr>
            <td style="padding-bottom:24px;">
              <div style="background:#111;border-radius:10px;padding:20px 20px 16px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Spot now</p>
                <p style="margin:0;font-size:32px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;letter-spacing:-0.03em;">${priceDisplay}</p>
                ${deltaStr ? `<p style="margin:6px 0 0;font-size:12px;font-weight:600;color:${deltaPct! >= 0 ? "#D4AF37" : "#ef4444"};font-variant-numeric:tabular-nums;">${deltaStr}</p>` : ""}
              </div>
            </td>
          </tr>

          <!-- Cheapest dealer block (gold / silver only) -->
          ${cheapestHtml ? `<tr><td style="padding-bottom:8px;">${cheapestHtml}</td></tr>` : ""}

          <!-- CTA -->
          <tr>
            <td style="padding-top:${cheapest ? "4px" : "0"};text-align:center;">
              <a href="${baseUrl}/dashboard"
                 style="display:inline-block;padding:13px 28px;${dashboardCtaStyle}font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;letter-spacing:0.01em;">
                See your dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);">
              ${disclosureHtml ? `<div style="margin-bottom:12px;">${disclosureHtml}</div>` : ""}
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're receiving this because you set a price alert on <a href="${baseUrl}" style="color:#555;text-decoration:none;">lode.rocks</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await queueEmail({
    alertId: alert.id,
    to: alert.user.email,
    subject,
    html,
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
