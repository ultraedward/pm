import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export type RawEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: RawEmailArgs) {
  const res = await resend.emails.send({
    from: "Alerts <alerts@yourdomain.com>",
    to,
    subject,
    html,
  });

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res.data;
}