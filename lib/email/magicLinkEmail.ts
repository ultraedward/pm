/**
 * Magic link email — sent when a user requests email sign-in.
 * Design language matches the weekly digest exactly.
 */

export function buildMagicLinkHtml(params: {
  url: string;
  host: string;
}): string {
  const { url, host } = params;

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

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#fff;line-height:1.2;">
                Your sign-in link.
              </h1>
              <p style="margin:0;font-size:14px;color:#666;">
                Click the button below to sign in to ${host}. This link expires in 24 hours and can only be used once.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:28px;text-align:center;">
              <a href="${url}"
                 style="display:inline-block;padding:13px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;letter-spacing:0.01em;">
                Sign in to Lode →
              </a>
            </td>
          </tr>

          <!-- Fallback URL -->
          <tr>
            <td style="background:#111;border-radius:10px;padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#555;">
                Or copy this link
              </p>
              <p style="margin:0;font-size:12px;color:#666;word-break:break-all;line-height:1.5;">
                ${url}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.<br>
                <a href="https://${host}" style="color:#555;text-decoration:none;">${host}</a>
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
