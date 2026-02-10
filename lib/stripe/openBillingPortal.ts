"use server";

import { stripe } from "./stripe";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export async function openBillingPortal() {
  const user = await requireUser();

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return session.url;
}