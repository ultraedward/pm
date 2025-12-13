import { Resend } from "resend";

export async function sendMagicLink({ to, url }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!key || !from) return { ok: true, skipped: true };

  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to,
    subject: "Your login link",
    html: `<p>Click to login:</p><p><a href="${url}">${url}</a></p>`
  });

  return { ok: true };
}
