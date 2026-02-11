import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/client";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.customer || !session.subscription) break;

      await prisma.user.updateMany({
        where: {
          stripeCustomerId: session.customer.toString(),
        },
        data: {
          stripeSubscriptionId: session.subscription.toString(),
          subscriptionStatus: "active",
        },
      });

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          subscriptionStatus: subscription.status,
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          subscriptionStatus: "canceled",
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}