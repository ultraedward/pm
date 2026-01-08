import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { returnUrl } = (await req.json().catch(() => ({}))) as {
    returnUrl?: string;
  };

  const safeReturnUrl =
    typeof returnUrl === "string" && returnUrl.length > 0
      ? returnUrl
      : process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/dashboard`
      : "http://localhost:3000/dashboard";

  // ✅ No DB field required: find-or-create Stripe customer by email
  const existing = await stripe.customers.list({
    email: session.user.email,
    limit: 1,
  });

  const customer =
    existing.data[0] ??
    (await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
    }));

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: safeReturnUrl,
  });

  return NextResponse.json({ url: portalSession.url });
}
