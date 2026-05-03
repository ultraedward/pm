/**
 * Welcome email — sent immediately on first sign-up via NextAuth createUser event.
 * Design language matches the weekly digest exactly.
 */

import { formatCurrency } from "@/lib/formatCurrency";

export function buildWelcomeHtml(params: {
  firstName: string;
  goldPrice: number | null;
  baseUrl: string;
  currency?: string;
}): string {
  const { firstName, goldPrice, baseUrl, currency = "USD" } = params;

  const greeting = firstName
    ? `Welcome, ${firstName}.`
    : "Welcome to Lode.";

  const goldDisplay = goldPrice ? formatCurrency(goldPrice, currency) : null;

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
                ${greeting}
              </h1>
              <p style="margin:0;font-size:14px;color:#666;">Your stack tracker is live. Here's what to do first.</p>
            </td>
          </tr>

          ${goldDisplay ? `
          <!-- Live gold price -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Gold · right now</p>
              <p style="margin:0;font-size:30px;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;">${goldDisplay}</p>
            </td>
          </tr>
          <tr><td style="height:20px;"></td></tr>
          ` : ""}

          <!-- Steps -->
          <tr>
            <td style="background:#111;border-radius:10px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">① Set your buy-target alert</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">Pick the price you want to buy at. Lode emails you the moment spot crosses it.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.04);">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">② Log your stack</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">Add your ounces once. Your total value and P&amp;L update with live spot every 15 minutes.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#fff;">③ Expect a Monday digest</p>
                    <p style="margin:0;font-size:12px;color:#555;line-height:1.5;">Every Monday we send spot prices, your portfolio value, and the cheapest dealer picks. Nothing to configure.</p>
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
                Set your first alert →
              </a>
              <p style="margin:14px 0 0;font-size:12px;color:#3a3a3a;">
                or go to your <a href="${baseUrl}/dashboard" style="color:#555;text-decoration:none;text-decoration:underline;">dashboard</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You're receiving this because you just created a Lode account.<br>
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
