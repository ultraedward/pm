import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

async function createCheckoutSession() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
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
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/account`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return session;
}

// GET — for direct link clicks
export async function GET() {
  const result = await createCheckoutSession();
  if (result instanceof NextResponse) return result;
  return NextResponse.redirect(result.url!);
}

// POST — handles both HTML <form method="POST"> and fetch() calls
// Browser forms include "text/html" in Accept; fetch calls don't.
export async function POST(req: Request) {
  const result = await createCheckoutSession();
  if (result instanceof NextResponse) return result;

  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    // HTML form submission — do a redirect directly to Stripe
    return NextResponse.redirect(result.url!, 303);
  }

  // fetch() from CreateAlertForm — return JSON so caller can redirect
  return NextResponse.json({ url: result.url });
}
