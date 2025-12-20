import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const useMock = process.env.USE_MOCK_DATA === "true";

export async function sendAlertEmail(to, subject, html) {
  if (useMock) {
    console.log("[MOCK EMAIL]", to, subject);
    return;
  }

  await resend.emails.send({
    from: "Precious Metals <no-reply@yourdomain.com>",
    to,
    subject,
    html,
  });
}

export async function sendMagicLink(email, token) {
  if (useMock) {
    console.log("[MOCK LOGIN]", email, token);
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  await sendAlertEmail(
    email,
    "Your sign-in link",
    `<p><a href="${url}">Sign in</a></p>`
  );
}

export default sendAlertEmail;
