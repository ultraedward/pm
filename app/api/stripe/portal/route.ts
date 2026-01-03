import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // must match SDK
});

export async function POST() {
  try {
    // Fetch full user (no select = no Prisma type errors)
    const user = await prisma.user.findFirst();

    // Safely read Stripe customer id (whatever your schema uses)
    const stripeCustomerId =
      (user as any)?.stripeCustomerId ||
      (user as any)?.stripe_customer_id ||
      (user as any)?.customerId ||
      null;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer not found for user" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL!,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe portal session" },
      { status: 500 }
    );
  }
}
