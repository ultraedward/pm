import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
type Metal = (typeof METALS)[number];

const METAL_COLOR: Record<Metal, string> = {
  gold: "#D4AF37",
  silver: "#C0C0C0",
  platinum: "#E5E4E2",
  palladium: "#9FA8C7",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function buildDigestHtml(params: {
  firstName: string;
  spots: Record<Metal, number>;
  weeklyPct: Record<Metal, number | null>;
  portfolioValue: number | null;
  portfolioGainLoss: number | null;
  portfolioPctReturn: number | null;
  hasHoldings: boolean;
  unsubscribeUrl?: string;
}) {
  const { firstName, spots, weeklyPct, portfolioValue, portfolioGainLoss, portfolioPctReturn, hasHoldings, unsubscribeUrl } = params;

  const metalRows = METALS.map((metal) => {
    const price = spots[metal];
    const pct = weeklyPct[metal];
    const color = METAL_COLOR[metal];
    const pctStr = pct !== null ? fmtPct(pct) : "—";
    const pctColor = pct !== null ? (pct >= 0 ? "#D4AF37" : "#ef4444") : "#666";
    const label = metal.charAt(0).toUpperCase() + metal.slice(1);

    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle;"></span>
          <span style="color:#aaa;font-size:13px;vertical-align:middle;">${label}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;font-size:15px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">
          ${price > 0 ? fmt(price) : "—"}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;font-size:13px;font-weight:600;color:${pctColor};font-variant-numeric:tabular-nums;">
          ${pctStr}
        </td>
      </tr>
    `;
  }).join("");

  const portfolioSection = hasHoldings && portfolioValue !== null
    ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#111;border-radius:10px;overflow:hidden;">
        <tr>
          <td style="padding:20px 20px 8px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Your Portfolio</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 20px;">
            <p style="margin:0;font-size:30px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;">${fmt(portfolioValue)}</p>
            ${portfolioGainLoss !== null && portfolioPctReturn !== null ? `
              <p style="margin:6px 0 0;font-size:13px;font-weight:600;color:${portfolioGainLoss >= 0 ? "#D4AF37" : "#ef4444"};font-variant-numeric:tabular-nums;">
                ${portfolioGainLoss >= 0 ? "+" : ""}${fmt(portfolioGainLoss)} (${fmtPct(portfolioPctReturn)}) all-time
              </p>
            ` : ""}
          </td>
        </tr>
      </table>
    `
    : `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#111;border-radius:10px;overflow:hidden;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;color:#aaa;">Track your stack on Lode</p>
            <p style="margin:0;font-size:12px;color:#555;">Add your holdings to see portfolio value every week.</p>
          </td>
        </tr>
      </table>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
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

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#fff;line-height:1.2;">
                Your weekly metals update${firstName ? `, ${firstName}` : ""}.
              </h1>
              <p style="margin:0;font-size:14px;color:#666;">Here's where the market stands this week.</p>
            </td>
          </tr>

          <!-- Spot prices table -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:4px 20px 0;">
              <p style="margin:12px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Spot Prices</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:left;font-size:10px;font-weight:600;color:#444;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Metal</th>
                    <th style="text-align:right;font-size:10px;font-weight:600;color:#444;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Price / oz</th>
                    <th style="text-align:right;font-size:10px;font-weight:600;color:#444;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">7-day</th>
                  </tr>
                </thead>
                <tbody>
                  ${metalRows}
                </tbody>
              </table>
              <div style="height:16px;"></div>
            </td>
          </tr>

          <!-- Portfolio section -->
          <tr><td>${portfolioSection}</td></tr>

          <!-- CTA -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <a href="https://lode.rocks/dashboard"
                 style="display:inline-block;padding:13px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;letter-spacing:0.01em;">
                Open Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);margin-top:40px;">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're receiving this from <a href="https://lode.rocks" style="color:#555;text-decoration:none;">lode.rocks</a>.<br>
                Questions? <a href="mailto:hello@lode.rocks" style="color:#555;text-decoration:none;">hello@lode.rocks</a>${unsubscribeUrl ? ` · <a href="${unsubscribeUrl}" style="color:#555;text-decoration:none;">Unsubscribe</a>` : ""}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function GET(req: Request) {
  // Auth: accept both cron secret (from Vercel) and admin secret (for manual test)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (adminSecret && authHeader === `Bearer ${adminSecret}`);

  if (!isAuthorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "Lode <onboarding@resend.dev>";

  // ── 1. Fetch current spot prices ──────────────────────────────────────
  const latestPriceRows = await Promise.all(
    METALS.map((metal) =>
      prisma.price.findFirst({
        where: { metal },
        orderBy: { timestamp: "desc" },
        select: { metal: true, price: true },
      })
    )
  );

  const spots = {} as Record<Metal, number>;
  for (const row of latestPriceRows) {
    if (row) spots[row.metal as Metal] = row.price;
  }

  // ── 2. Fetch prices from ~7 days ago for weekly % change ──────────────
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekOldRows = await Promise.all(
    METALS.map((metal) =>
      prisma.price.findFirst({
        where: { metal, timestamp: { lte: sevenDaysAgo } },
        orderBy: { timestamp: "desc" },
        select: { metal: true, price: true },
      })
    )
  );

  const weeklyPct = {} as Record<Metal, number | null>;
  for (const row of weekOldRows) {
    if (row && spots[row.metal as Metal] > 0 && row.price > 0) {
      weeklyPct[row.metal as Metal] =
        ((spots[row.metal as Metal] - row.price) / row.price) * 100;
    } else {
      weeklyPct[(row?.metal ?? "gold") as Metal] = null;
    }
  }
  // Ensure all metals have a value
  for (const metal of METALS) {
    if (!(metal in weeklyPct)) weeklyPct[metal] = null;
  }

  // ── 3. Fetch Pro users who have an email ──────────────────────────────
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      subscriptionStatus: "active",
    },
    select: {
      id: true,
      email: true,
      name: true,
      subscriptionStatus: true,
      proUntil: true,
      holdings: {
        select: { metal: true, ounces: true, purchasePrice: true },
      },
    },
  });

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.email) { skipped++; continue; }

    // Double-check Pro access (handles proUntil grace period)
    const isPro = hasProAccess({ stripeStatus: user.subscriptionStatus, proUntil: user.proUntil });
    if (!isPro) { skipped++; continue; }

    // ── Compute portfolio totals ──────────────────────────────────────
    let totalInvested = 0;
    let totalValue = 0;
    for (const h of user.holdings) {
      const spot = spots[h.metal as Metal] ?? h.purchasePrice;
      totalInvested += h.ounces * h.purchasePrice;
      totalValue += h.ounces * (spot || h.purchasePrice);
    }
    const hasHoldings = user.holdings.length > 0;
    const gainLoss = totalValue - totalInvested;
    const pctReturn = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : null;

    const firstName = user.name?.split(" ")[0] ?? "";

    const html = buildDigestHtml({
      firstName,
      spots,
      weeklyPct,
      portfolioValue: hasHoldings ? totalValue : null,
      portfolioGainLoss: hasHoldings ? gainLoss : null,
      portfolioPctReturn: pctReturn,
      hasHoldings,
    });

    try {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Your weekly precious metals update — Lode",
        html,
      });
      sent++;
    } catch (err) {
      console.error(`Digest email failed for ${user.email}:`, err);
      errors.push(user.email);
    }
  }

  // ── 4. Send spot-prices-only digest to email-only subscribers ────
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://lode.rocks";
  const subscribers = await prisma.emailSubscriber.findMany({
    where: { active: true },
  });

  for (const sub of subscribers) {
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${sub.unsubscribeToken}`;
    const html = buildDigestHtml({
      firstName: "",
      spots,
      weeklyPct,
      portfolioValue: null,
      portfolioGainLoss: null,
      portfolioPctReturn: null,
      hasHoldings: false,
      unsubscribeUrl,
    });

    try {
      await resend.emails.send({
        from,
        to: sub.email,
        subject: "Your weekly precious metals update — Lode",
        html,
      });
      sent++;
    } catch (err) {
      console.error(`Digest email failed for subscriber ${sub.email}:`, err);
      errors.push(sub.email);
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  });
}
