import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export const dynamic = "force-dynamic"

function randomPercent(min: number, max: number) {
  return (Math.random() * (max - min) + min) / 100
}

export async function GET() {
  const metals = await prisma.metal.findMany()

  await Promise.all(
    metals.map(async (metal) => {
      const pct = randomPercent(-0.6, 0.6)
      const price = Number((metal.price * (1 + pct)).toFixed(2))

      await prisma.priceHistory.create({
        data: { metalId: metal.id, price }
      })

      await prisma.metal.update({
        where: { id: metal.id },
        data: { price }
      })
    })
  )

  return NextResponse.json({ status: "ok" })
}
