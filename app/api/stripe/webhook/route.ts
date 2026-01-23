import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// IMPORTANT: Stripe needs the raw request body for signature verification.
// In Next.js App Router, `req.text()` gives you the raw body string.
export async function POST(req: Request) {
  const sig = headers().get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    const rawBody = await req.text()
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        // You can use session.customer / session.subscription to link to a user later.
        console.log("checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          email: session.customer_details?.email,
        })
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription

        console.log(event.type, {
          id: sub.id,
          customer: sub.customer,
          status: sub.status,
          current_period_end: sub.current_period_end,
          cancel_at_period_end: sub.cancel_at_period_end,
          items: sub.items.data.map((i) => ({
            priceId: i.price.id,
            product: i.price.product,
            quantity: i.quantity,
          })),
        })

        break
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.log(event.type, {
          id: invoice.id,
          customer: invoice.customer,
          subscription: invoice.subscription,
          status: invoice.status,
          hosted_invoice_url: invoice.hosted_invoice_url,
        })
        break
      }

      default: {
        // Keep it quiet-ish, but log type so you can add handling later
        console.log("Unhandled Stripe event:", event.type)
        break
      }
    }
  } catch (err) {
    // If your handler throws, Stripe will retry. Sometimes you want that.
    // For now, we log and still return 200 so deploys aren’t blocked.
    console.error("Stripe webhook handler error:", err)
  }

  return NextResponse.json({ received: true })
}