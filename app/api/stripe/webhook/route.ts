// app/api/stripe/webhook/route.ts

import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // ✅ NAMED import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const email = session.customer_details?.email
    const customerId = session.customer?.toString()

    if (!email || !customerId) {
      console.warn("⚠️ Missing email or customerId in session")
      return NextResponse.json({ received: true })
    }

    await prisma.user.updateMany({
      where: { email },
      data: {
        isPro: true,
        stripeCustomerId: customerId,
      },
    })

    console.log(`✅ User upgraded to Pro: ${email}`)
  }

  return NextResponse.json({ received: true })
}
