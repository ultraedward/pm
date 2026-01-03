import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST() {
  const user = await prisma.user.findFirst({
    select: { stripeCustomerId: true },
  });

  if (!user || !user.stripeCustomerId) {
    return Response.json(
      { error: "No billing account found" },
      { status: 401 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return Response.json({ url: session.url });
}
