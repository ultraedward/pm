import { prisma } from "./prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function processAlerts(
  metal: "gold" | "silver",
  price: number
) {
  const settings = await prisma.alertSettings.findFirst()
  if (!settings) return

  const threshold =
    metal === "gold" ? settings.goldThreshold : settings.silverThreshold

  if (price < threshold) return

  // 🚫 Dedupe: same metal within last 30 minutes
  const recent = await prisma.alertEvent.findFirst({
    where: {
      metal,
      createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
    },
  })

  if (recent) return

  await prisma.alertEvent.create({
    data: { metal, price },
  })

  await resend.emails.send({
    from: process.env.ALERT_EMAIL_FROM!,
    to: process.env.ALERT_EMAIL_TO!,
    subject: `🚨 ${metal.toUpperCase()} Alert`,
    html: `<p>${metal} crossed <strong>$${price}</strong></p>`,
  })
}
