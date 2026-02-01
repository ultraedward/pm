import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    // ✅ Checkout completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) throw new Error("Missing userId metadata");

      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: session.subscription as string,
        },
        update: {
          status: "active",
        },
        create: {
          userId,
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          status: "active",
        },
      });
    }

    // ✅ Recurring invoice paid
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: invoice.subscription as string,
        },
        data: {
          status: "active",
          currentPeriodEnd: new Date(invoice.period_end * 1000),
        },
      });
    }

    // ❌ Subscription canceled
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: sub.id,
        },
        data: {
          status: "canceled",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}