import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

/**
 * NOTE:
 * Stripe's TypeScript types hard-pin apiVersion.
 * We intentionally cast to avoid build-time failures
 * for one-off admin scripts.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();

async function main() {
  const subs = await stripe.subscriptions.list({ limit: 100 });

  for (const sub of subs.data) {
    if (!sub.customer || typeof sub.customer !== "string") continue;

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: sub.id },
      update: {
        status: sub.status,
        currentPeriodEnd: sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null,
      },
      create: {
        stripeSubscriptionId: sub.id,
        stripeCustomerId: sub.customer,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Stripe subscriptions backfilled");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });