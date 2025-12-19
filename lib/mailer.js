import { Resend } from "resend";

/**
 * Lazily create Resend client so imports don't crash
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local to enable email alerts."
    );
  }

  return new Resend(apiKey);
}

/**
 * Send a price alert email
 */
export default async function sendAlertEmail({
  to,
  metal,
  price,
  target,
  direction,
}) {
  const resend = getResendClient();

  const subject =
    direction === "above"
      ? `${metal} price is above your target`
      : `${metal} price is below your target`;

  const html = `
    <h2>🚨 Price Alert</h2>
    <p><strong>${metal}</strong> price alert triggered.</p>
    <p><strong>Current price:</strong> ${price}</p>
    <p><strong>Your target:</strong> ${target}</p>
    <p><strong>Direction:</strong> ${direction}</p>
  `;

  await resend.emails.send({
    from: "Precious Metals <alerts@yourdomain.com>",
    to,
    subject,
    html,
  });
}
