/**
 * Annual tax snapshot email — sent Jan 1 to all Pro users.
 * Shows Dec 31 portfolio value, cost basis, and gain/loss for each metal.
 * Designed to be forwarded directly to an accountant.
 */

import { formatCurrency } from "@/lib/formatCurrency";

const fmt = (n: number, currency = "USD") => formatCurrency(n, currency);

export type TaxHoldingRow = {
  metal: string;
  ounces: number;
  costBasis: number;
  spotPrice: number;
  currentValue: number;
  gainLoss: number;
  gainPct: number;
};

export function buildTaxSnapshotHtml(params: {
  firstName: string;
  year: number; // the tax year (e.g. 2025 for the Dec 31 2025 snapshot)
  holdings: TaxHoldingRow[];
  totalCostBasis: number;
  totalValue: number;
  totalGainLoss: number;
  currency: string;
  baseUrl: string;
}): string {
  const { firstName, year, holdings, totalCostBasis, totalValue, totalGainLoss, currency, baseUrl } = params;
  const isGain = totalGainLoss >= 0;
  const gainColor = isGain ? "#4ade80" : "#f87171";
  const name = firstName || "there";

  const holdingRows = holdings.map((h) => {
    const metal = h.metal.charAt(0).toUpperCase() + h.metal.slice(1);
    const hGain = h.gainLoss >= 0;
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#fff;font-weight:600;">${metal}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#999;text-align:right;">${h.ounces.toFixed(4)} oz</td>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#999;text-align:right;">${fmt(h.costBasis, currency)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#999;text-align:right;">${fmt(h.currentValue, currency)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;text-align:right;color:${hGain ? "#4ade80" : "#f87171"};">${hGain ? "+" : ""}${fmt(h.gainLoss, currency)}</td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <div style="display:none;max-height:0;overflow:hidden;color:#0a0907;">Your ${year} precious metals portfolio snapshot — cost basis, current value, and gain/loss for tax season.&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;</div>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Lode</p>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:8px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">${year} Tax Snapshot · Dec 31</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:28px;">
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#fff;line-height:1.15;">
                Hi ${name} — here's your stack as of Dec 31.
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:#666;line-height:1.5;">
                Forward this to your accountant or use it alongside your brokerage statements.
                Prices are closing spot on December 31, ${year}.
              </p>
            </td>
          </tr>

          <!-- Total summary -->
          <tr>
            <td style="background:#111;padding:20px 24px;margin-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Total Portfolio Value</p>
                    <p style="margin:6px 0 0;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.03em;">${fmt(totalValue, currency)}</p>
                  </td>
                  <td style="text-align:right;vertical-align:bottom;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:${gainColor};">${isGain ? "+" : ""}${fmt(totalGainLoss, currency)}</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#555;">vs. cost basis of ${fmt(totalCostBasis, currency)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Holdings table -->
          <tr>
            <td>
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">By Metal</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="font-size:10px;color:#555;text-align:left;padding-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Metal</th>
                    <th style="font-size:10px;color:#555;text-align:right;padding-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Ounces</th>
                    <th style="font-size:10px;color:#555;text-align:right;padding-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Cost Basis</th>
                    <th style="font-size:10px;color:#555;text-align:right;padding-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Value</th>
                    <th style="font-size:10px;color:#555;text-align:right;padding-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  ${holdingRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- CSV export CTA -->
          <tr>
            <td style="background:#111;padding:16px 20px;">
              <p style="margin:0;font-size:13px;color:#999;">
                Need a spreadsheet? <a href="${baseUrl}/api/portfolio/export" style="color:#D4AF37;text-decoration:none;font-weight:600;">Download your portfolio CSV →</a>
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Disclaimer -->
          <tr>
            <td>
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                This snapshot is for informational purposes only and is not tax advice.
                Consult a qualified tax professional for guidance on your specific situation.
                Spot prices are sourced from public market data as of December 31 close.
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1a1a1a;padding-top:20px;">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're receiving this because you're a Lode Pro subscriber.<br>
                <a href="${baseUrl}" style="color:#555;text-decoration:none;">lode.rocks</a>
                &nbsp;·&nbsp;
                <a href="mailto:hello@lode.rocks" style="color:#555;text-decoration:none;">hello@lode.rocks</a>
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
