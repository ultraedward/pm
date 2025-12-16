import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail({ to, url }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your login link",
    html: `
      <h2>Login</h2>
      <p>Click below to log in:</p>
      <p><a href="${url}">Log in</a></p>
      <p>This link expires in 15 minutes.</p>
    `
  });
}

export async function sendAlertEmail({ to, metal, premium }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: `${metal} alert triggered`,
    html: `
      <h2>${metal} Alert</h2>
      <p>Premium reached: <b>${premium.toFixed(2)}%</b></p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account">View account</a>
    `
  });
}
