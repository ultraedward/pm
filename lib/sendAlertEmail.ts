import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendAlertEmail({
  to,
  metal,
  direction,
  target,
  currentPrice,
}: {
  to: string
  metal: string
  direction: string
  target: any
  currentPrice: number
}) {
  await transporter.sendMail({
    from: `"Precious Metals Alerts" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `🚨 ${metal.toUpperCase()} Alert Triggered`,
    text: `
${metal.toUpperCase()} alert fired!

Direction: ${direction}
Target: ${target}
Current price: ${currentPrice}
`,
  })
}
