/**
 * Onboarding nudge emails.
 * Design language matches the weekly digest exactly.
 *
 * Day-3: Users with no alerts and no holdings, created 3 days ago.
 *        Goal: set their first price alert.
 *
 * Day-7: Users with no alerts and no holdings, created 7 days ago.
 *        Goal: re-engage with live prices, two clear actions.
 */

import { formatCurrency } from "@/lib/formatCurrency";
const fmt = (n: number, currency = "USD") => formatCurrency(n, currency);

// ─── Day 3 ────────────────────────────────────────────────────────────────────

export function buildDay3Html(params: {
  firstName: string;
  goldPrice: number | null;
  baseUrl: string;
  currency?: string;
}): string {
  const { firstName, goldPrice, baseUrl, currency = "USD" } = params;

  const goldDisplay = goldPrice ? fmt(goldPrice, currency) : null;

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
                ${firstName ? `${firstName}, you` : "You"} haven't set a target yet.
              </h1>
              <p style="margin:0;font-size:14px;color:#666;">When spot crosses your number, Lode sends you an email. No app. No chart-watching.</p>
            </td>
          </tr>

          ${goldDisplay ? `
          <!-- Live gold price -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:16px 20px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Gold · right now</p>
              <p style="margin:0;font-size:30px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;">${goldDisplay}</p>
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          ` : ""}

          <!-- How alerts work -->
          <tr>
            <td style="background:#111;border-radius:10px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">① Pick your target price</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">The level you want to buy at — or the level you want to know about.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">② Spot crosses it</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">Lode checks daily. The moment your level is hit, the alert fires.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">③ You get an email</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">That's it. No noise between now and then.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <a href="${baseUrl}/alerts/new"
                 style="display:inline-block;padding:13px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;letter-spacing:0.01em;">
                Set my buy target →
              </a>
              <p style="margin:14px 0 0;font-size:12px;color:#3a3a3a;">30 seconds. Free forever.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're getting this because you have a Lode account with no alerts set yet.<br>
                <a href="${baseUrl}" style="color:#555;text-decoration:none;">lode.rocks</a>
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

// ─── Day 7 ────────────────────────────────────────────────────────────────────

export function buildDay7Html(params: {
  firstName: string;
  goldPrice: number | null;
  silverPrice: number | null;
  baseUrl: string;
  currency?: string;
}): string {
  const { firstName, goldPrice, silverPrice, baseUrl, currency = "USD" } = params;

  const goldRow = goldPrice
    ? `<tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#D4AF37;margin-right:8px;vertical-align:middle;"></span>
          <span style="color:#aaa;font-size:13px;vertical-align:middle;">Gold</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;font-size:15px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">
          ${fmt(goldPrice, currency)}
        </td>
      </tr>`
    : "";

  const silverRow = silverPrice
    ? `<tr>
        <td style="padding:12px 0;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#C0C0C0;margin-right:8px;vertical-align:middle;"></span>
          <span style="color:#aaa;font-size:13px;vertical-align:middle;">Silver</span>
        </td>
        <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">
          ${fmt(silverPrice, currency)}
        </td>
      </tr>`
    : "";

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
                ${firstName ? `${firstName}, here` : "Here"}'s where spot stands.
              </h1>
              <p style="margin:0;font-size:14px;color:#666;">Your dashboard has been tracking this all week.</p>
            </td>
          </tr>

          ${goldRow || silverRow ? `
          <!-- Spot prices -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:4px 20px 0;">
              <p style="margin:12px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Spot Prices</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tbody>
                  ${goldRow}
                  ${silverRow}
                </tbody>
              </table>
              <div style="height:16px;"></div>
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          ` : ""}

          <!-- Re-engage nudge -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:20px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fff;">Still getting started?</p>
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">
                Set a price alert in 30 seconds and you'll never miss your buy target again. Log your stack once and your P&amp;L updates itself.
              </p>
            </td>
          </tr>

          <!-- CTAs — stacked for email reliability -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <a href="${baseUrl}/alerts/new"
                 style="display:inline-block;padding:13px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;letter-spacing:0.01em;">
                Set an alert →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top:12px;text-align:center;">
              <a href="${baseUrl}/dashboard/holdings"
                 style="display:inline-block;padding:13px 28px;border:1px solid rgba(255,255,255,0.12);color:#aaa;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px;">
                Log my stack
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're receiving this because you have a Lode account. Questions? <a href="mailto:hello@lode.rocks" style="color:#555;text-decoration:none;">hello@lode.rocks</a><br>
                <a href="${baseUrl}" style="color:#555;text-decoration:none;">lode.rocks</a>
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
