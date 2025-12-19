import Stripe from "stripe";
import { buffer } from "micro";
import { prisma } from "../../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (!session.subscription || !session.metadata?.userId) break;

      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: session.subscription,
        },
        update: {
          status: "active",
        },
        create: {
          userId: session.metadata.userId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: "active",
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: "canceled",
        },
      });

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
}
