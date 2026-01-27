import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const prisma = new PrismaClient();

async function run() {
  let startingAfter: string | undefined = undefined;

  while (true) {
    const subs = await stripe.subscriptions.list({
      limit: 100,
      starting_after: startingAfter,
      status: "all",
      expand: ["data.items.data.price"],
    });

    for (const sub of subs.data) {
      const price = sub.items.data[0]?.price?.id ?? null;
      const currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;

      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: sub.id },
        update: {
          stripeCustomerId: String(sub.customer),
          status: sub.status,
          priceId: price,
          currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
        create: {
          stripeSubscriptionId: sub.id,
          stripeCustomerId: String(sub.customer),
          status: sub.status,
          priceId: price,
          currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
    }

    if (!subs.has_more) break;
    startingAfter = subs.data[subs.data.length - 1].id;
  }
}

run()
  .then(() => {
    console.log("Backfill complete");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });