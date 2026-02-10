import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function openBillingPortal() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!dbUser?.stripeCustomerId) {
    throw new Error("No Stripe customer found for user");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return portalSession.url;
}