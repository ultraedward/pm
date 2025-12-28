export const runtime = "nodejs"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
    { cache: "no-store" }
  )

  const data = await res.json()

  await prisma.pricePoint.createMany({
    data: [
      { metal: "gold", price: data.rates.USDXAU },
      { metal: "silver", price: data.rates.USDXAG },
    ],
  })

  return Response.json({ ok: true })
}
