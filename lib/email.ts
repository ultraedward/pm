import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendAlertEmail(
  to: string,
  alerts: {
    metal: string;
    direction: string;
    threshold: number;
  }[]
) {
  if (!alerts.length) return;

  if (!isValidEmail(to)) {
    throw new Error("Invalid email address");
  }

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
