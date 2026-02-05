import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { ok: false, error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // 🚨 TEMP STUB — NO DATABASE SIDE EFFECTS
  // Subscription table does not exist yet.
  // We acknowledge Stripe events only.

  return NextResponse.json({ received: true });
}