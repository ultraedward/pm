import { stripe } from "@/lib/stripe/client";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export async function createCheckoutSession() {
  const user = await requireUser();

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
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
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/alerts`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return session.url!;
}