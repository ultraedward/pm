import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail({
  to,
  metal,
  price,
  target,
  direction,
}: {
  to: string;
  metal: string;
  price: number;
  target: number;
  direction: string;
}) {
  await resend.emails.send({
    from: process.env.ALERT_FROM_EMAIL!,
    to,
    subject: `${metal} price alert triggered`,
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>${metal} Alert</h2>
        <p>
          Price has gone <b>${direction}</b> your target.
        </p>
        <p>
          Target: <b>$${target.toFixed(2)}</b><br/>
          Current: <b>$${price.toFixed(2)}</b>
        </p>
      </div>
    `,
  });
}
