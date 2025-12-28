import { prisma } from "./prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function processAlerts(
  metalId: string,
  currentPrice: number
) {
  const settings = await prisma.alertSettings.findFirst()
  if (!settings) return

  if (metalId === "gold" && currentPrice >= settings.goldThreshold) {
    await prisma.alertEvent.create({
      data: {
        metal: "gold",
        price: currentPrice,
      },
    })

    await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: process.env.ALERT_EMAIL_TO!,
      subject: "🚨 Gold Alert",
      html: `<p>Gold crossed <strong>$${currentPrice}</strong></p>`,
    })
  }

  if (metalId === "silver" && currentPrice >= settings.silverThreshold) {
    await prisma.alertEvent.create({
      data: {
        metal: "silver",
        price: currentPrice,
      },
    })

    await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: process.env.ALERT_EMAIL_TO!,
      subject: "🚨 Silver Alert",
      html: `<p>Silver crossed <strong>$${currentPrice}</strong></p>`,
    })
  }
}
