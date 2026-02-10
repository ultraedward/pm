"use server";

import { stripe } from "./stripe";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export async function createCheckoutSession() {
  const user = await requireUser();

  let subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        status: "inactive",
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email!,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/alerts`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId: user.id,
    },
  });

  return session.url!;
}