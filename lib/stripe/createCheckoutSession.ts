import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      email: true,
      stripeCustomerId: true,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  let customerId = dbUser.stripeCustomerId;

  // Create Stripe customer if missing
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email ?? undefined,
      metadata: {
        userId: user.id,
      },
    });

    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/alerts`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });

  if (!session.url) {
    throw new Error("Stripe checkout session missing URL");
  }

  return session.url;
}