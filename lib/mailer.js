import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send alert email
 */
async function sendAlertEmail(to, subject, html) {
  await resend.emails.send({
    from: "Precious Metals <no-reply@yourdomain.com>",
    to,
    subject,
    html,
  });
}

/**
 * Send magic login link
 */
export async function sendMagicLink(email, token) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  await sendAlertEmail(
    email,
    "Your sign-in link",
    `
      <p>Click the link below to sign in:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires soon.</p>
    `
  );
}

/**
 * Default export (used by alertsChecker)
 */
export default sendAlertEmail;
