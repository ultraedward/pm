import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
  }

  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, stripeCustomerId: true },
  });

  if (!dbUser?.email) {
    return new NextResponse("User missing email", { status: 400 });
  }

  let customerId = dbUser.stripeCustomerId;

  // Create customer if missing
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      metadata: { userId: user.id },
    });

    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const returnUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/account`,
  });

  return NextResponse.redirect(session.url, { status: 303 });
}