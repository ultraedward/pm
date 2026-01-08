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
    console.error("❌ Webhook signature error:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      /**
       * ✅ SUCCESSFUL CHECKOUT
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session.client_reference_id || !session.customer) break

        await prisma.user.update({
          where: { id: session.client_reference_id },
          data: {
            isPro: true,
            stripeCustomerId: session.customer.toString(),
          },
        })

        break
      }

      /**
       * 🔄 SUBSCRIPTION UPDATED
       */
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription

        const customerId = sub.customer.toString()
        const isActive = sub.status === "active"

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { isPro: isActive },
        })

        break
      }

      /**
       * ❌ SUBSCRIPTION CANCELED / DELETED
       */
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription

        const customerId = sub.customer.toString()

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { isPro: false },
        })

        break
      }
    }
  } catch (err) {
    console.error("❌ Webhook handler error:", err)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }

  return NextResponse.json({ received: true })
}
