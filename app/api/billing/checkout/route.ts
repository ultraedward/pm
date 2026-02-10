import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function GET() {
  // 1. Get session user (identity only)
  const sessionUser = await requireUser();

  // 2. Load full DB user (billing fields live here)
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  let customerId = user.stripeCustomerId;

  // 3. Create Stripe customer if missing
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
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

  // 4. Create checkout session
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

  return NextResponse.redirect(session.url!);
}