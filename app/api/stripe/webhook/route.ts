import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error("❌ Stripe signature verification failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const raw = sub as any

        const priceId =
          sub.items.data[0]?.price?.id ?? null

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: sub.id },
          update: {
            status: sub.status,
            currentPeriodEnd: raw.current_period_end
              ? new Date(raw.current_period_end * 1000)
              : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            priceId,
          },
          create: {
            stripeSubscriptionId: sub.id,
            stripeCustomerId: String(sub.customer),
            status: sub.status,
            currentPeriodEnd: raw.current_period_end
              ? new Date(raw.current_period_end * 1000)
              : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            priceId,
          },
        })

        break
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.subscription && session.customer) {
          await prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: String(session.subscription),
            },
            data: {
              stripeCustomerId: String(session.customer),
            },
          })
        }

        break
      }

      default:
        break
    }
  } catch (err) {
    console.error("⚠️ Webhook processing error", err)
  }

  return NextResponse.json({ received: true })
}