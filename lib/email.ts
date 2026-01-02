import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail(
  to: string,
  alerts: {
    metal: string;
    direction: string;
    threshold: number;
  }[]
) {
  if (!alerts.length) return;

  const html = `
    <h2>Precious Metals Alerts</h2>
    <p>The following alerts are currently active:</p>
    <ul>
      ${alerts
        .map(
          (a) =>
            `<li>${a.metal} ${a.direction} ${a.threshold}</li>`
        )
        .join("")}
    </ul>
  `;

  await resend.emails.send({
    from: process.env.ALERT_EMAIL_FROM!,
    to,
    subject: "Your Precious Metals Alerts",
    html,
  });
}
