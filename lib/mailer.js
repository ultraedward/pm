import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send magic login link
 */
export async function sendMagicLink(email, token) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "Precious Metals <no-reply@yourdomain.com>",
    to: email,
    subject: "Your sign-in link",
    html: `
      <p>Click the link below to sign in:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link expires soon.</p>
    `,
  });
}
