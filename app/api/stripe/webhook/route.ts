import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  /* ------------------------------
     SUBSCRIPTION EVENTS (SOURCE OF TRUTH)
     ------------------------------ */
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription

    const customerId = subscription.customer?.toString()
    if (!customerId) {
      return NextResponse.json({ received: true })
    }

    const isActive = subscription.status === "active"

    await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { isPro: isActive },
    })
  }

  /* ------------------------------
     CHECKOUT (initial link)
     ------------------------------ */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.customer && session.client_reference_id) {
      await prisma.user.update({
        where: { id: session.client_reference_id },
        data: {
          stripeCustomerId: session.customer.toString(),
          isPro: true,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
