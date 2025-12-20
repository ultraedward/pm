// FILE: lib/mailer.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const useMock = process.env.USE_MOCK_DATA === "true";

export async function sendAlertEmail(to, subject, html) {
  if (useMock) {
    console.log("[MOCK EMAIL]", { to, subject });
    return { mock: true };
  }

  return resend.emails.send({
    from: "Precious Metals <no-reply@yourdomain.com>",
    to,
    subject,
    html,
  });
}

export async function sendEmail(to, subject, html) {
  return sendAlertEmail(to, subject, html);
}

export async function sendMagicLink(email, token) {
  if (useMock) {
    console.log("[MOCK MAGIC LINK]", { email, token });
    return { mock: true };
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  return sendAlertEmail(
    email,
    "Your sign-in link",
    `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`
  );
}

export default sendAlertEmail;
