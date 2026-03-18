import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

async function createCheckoutSession(interval: "month" | "year" = "month") {
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

  const priceId =
    interval === "year"
      ? process.env.STRIPE_PRICE_ANNUAL!
      : process.env.STRIPE_PRICE_MONTHLY!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/account`,
    cancel_url:  `${process.env.NEXTAUTH_URL}/pricing`,
  });

  return session;
}

// GET — defaults to monthly
export async function GET() {
  const result = await createCheckoutSession("month");
  if (result instanceof NextResponse) return result;
  return NextResponse.redirect(result.url!);
}

// POST — reads interval from form body
export async function POST(req: Request) {
  const formData = await req.formData();
  const interval = formData.get("interval") === "year" ? "year" : "month";

  const result = await createCheckoutSession(interval);
  if (result instanceof NextResponse) return result;

  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(result.url!, 303);
  }

  return NextResponse.json({ url: result.url });
}
