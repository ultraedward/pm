export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: "Metals API failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const data = await res.json()

    if (!data?.rates?.USDXAU || !data?.rates?.USDXAG) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid Metals API payload" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    await prisma.pricePoint.createMany({
      data: [
        { metal: "gold", price: data.rates.USDXAU },
        { metal: "silver", price: data.rates.USDXAG },
      ],
    })

    return new Response(
      JSON.stringify({
        ok: true,
        gold: data.rates.USDXAU,
        silver: data.rates.USDXAG,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Unhandled exception",
        message: String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
