import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getSession(req);

    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find active subscription for this user
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription?.stripeCustomerId) {
      return res.status(400).json({
        error: "No active subscription found for user",
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error("Billing portal error:", error);
    return res.status(500).json({ error: "Failed to open billing portal" });
  }
}
