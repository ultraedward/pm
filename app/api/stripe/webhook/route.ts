import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ✅ HANDLE SUBSCRIPTION EVENTS (NOT CHECKOUT)
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription

    const customerId = subscription.customer.toString()

    await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { isPro: subscription.status === "active" },
    })
  }

  return NextResponse.json({ received: true })
}
