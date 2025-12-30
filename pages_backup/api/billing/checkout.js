import { stripe } from "../../../lib/stripe";
import { getSession } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const session = await getSession(req);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({ error: "STRIPE_PRICE_ID is missing" });
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return res.status(500).json({ error: "NEXT_PUBLIC_APP_URL is missing" });
  }

  // Prevent duplicate active subscriptions
  const existing = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "active",
    },
  });

  if (existing) {
    return res.status(409).json({
      error: "User already has an active subscription",
    });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return res.status(200).json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ error: "Stripe checkout failed" });
  }
}
