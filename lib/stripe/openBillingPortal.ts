import { stripe } from "@/lib/stripe/client";
import { requireUser } from "@/lib/requireUser";

export async function openBillingPortal() {
  const user = await requireUser();

  if (!user.stripeCustomerId) {
    throw new Error("No Stripe customer found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return session.url;
}