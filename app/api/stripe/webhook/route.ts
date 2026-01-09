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

  /* ----------------------------
     UPGRADE → PRO
  -----------------------------*/
  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const obj: any = event.data.object
    const customerId = obj.customer
    const status = obj.status

    if (customerId && status === "active") {
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPro: true },
      })
    }
  }

  /* ----------------------------
     DOWNGRADE → FREE
  -----------------------------*/
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "invoice.payment_failed"
  ) {
    const obj: any = event.data.object
    const customerId = obj.customer

    if (customerId) {
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPro: false },
      })
    }
  }

  return NextResponse.json({ received: true })
}
