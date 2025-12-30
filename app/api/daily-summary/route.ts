import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const prices = await prisma.pricePoint.findMany({
    orderBy: { createdAt: "desc" },
    take: 1,
  })

  await resend.emails.send({
    from: process.env.ALERT_EMAIL_FROM!,
    to: process.env.ALERT_EMAIL_TO!,
    subject: "Daily Summary",
    html: `<pre>${JSON.stringify(prices, null, 2)}</pre>`,
  })

  return Response.json({ ok: true })
}
