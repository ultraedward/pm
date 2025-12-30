import { NextResponse } from "next/server"

let price = 2400

export async function GET() {
  const delta = (Math.random() - 0.5) * 10
  price = Math.round((price + delta) * 100) / 100

  return NextResponse.json({
    price,
    alertTriggered: price >= 2425,
  })
}
