import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendAlertEmailParams = {
  to: string;
  metal: string;
  direction: string;
  currentPrice: number;
  percentChange: number;
};

export async function sendAlertEmail({
  to,
  metal,
  direction,
  currentPrice,
  percentChange,
}: SendAlertEmailParams) {
  const isUp = percentChange >= 0;

  await resend.emails.send({
    from: "Precious Metals <alerts@yourdomain.com>",
    to,
    subject: `${metal.toUpperCase()} alert triggered`,
    html: `
      <div style="font-family: sans-serif; padding: 24px; background: #0b0b0b; color: white;">
        <h2 style="margin-bottom: 16px;">
          ${metal.toUpperCase()} Alert Triggered
        </h2>

        <p style="font-size: 16px;">
          Your alert for <strong>${metal}</strong> going <strong>${direction}</strong> has triggered.
        </p>

        <div style="margin-top: 20px; padding: 16px; background: #111; border-radius: 8px;">
          <p style="margin: 0;">
            Current price: <strong>$${currentPrice.toFixed(2)}</strong>
          </p>
          <p style="margin: 6px 0 0;">
            24h change: 
            <strong style="color: ${isUp ? "#16a34a" : "#dc2626"};">
              ${isUp ? "▲" : "▼"} ${percentChange.toFixed(2)}%
            </strong>
          </p>
        </div>

        <a href="https://pm-iota-wheat.vercel.app"
           style="display:inline-block;margin-top:24px;padding:12px 18px;background:white;color:black;text-decoration:none;border-radius:6px;">
          View Dashboard
        </a>

        <p style="margin-top:40px;font-size:12px;color:#666;">
          You’re receiving this because you created an alert.
        </p>
      </div>
    `,
  });
}