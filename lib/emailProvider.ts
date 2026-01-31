import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendRawEmail(args: {
  to: string;
  subject: string;
  html: string;
}) {
  await resend.emails.send({
    from: "alerts@yourdomain.com",
    to: args.to,
    subject: args.subject,
    html: args.html,
  });
}