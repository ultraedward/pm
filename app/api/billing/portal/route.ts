import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/client";

export async function POST() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser || !dbUser.stripeCustomerId) {
    return Response.json(
      { error: "No Stripe customer" },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/alerts`,
  });

  return Response.json({ url: session.url });
}