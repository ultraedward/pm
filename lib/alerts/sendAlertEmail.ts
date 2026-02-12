import nodemailer from "nodemailer";

export async function sendAlertEmail({
  to,
  metal,
  price,
  direction,
}: {
  to: string;
  metal: string;
  price: number;
  direction: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const formattedMetal = metal === "gold" ? "Gold (XAU)" : "Silver (XAG)";
  const formattedDirection =
    direction === "above" ? "rose above" : "fell below";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `${formattedMetal} price alert triggered`,
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>${formattedMetal} Alert Triggered</h2>
        <p>The price has ${formattedDirection} your target.</p>
        <p><strong>Current price:</strong> $${price.toFixed(2)}</p>
        <br/>
        <p>— Precious Metals Tracker</p>
      </div>
    `,
  });
}