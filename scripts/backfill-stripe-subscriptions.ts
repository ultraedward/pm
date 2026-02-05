/**
 * TEMP STUB
 * Subscription model has been removed from Prisma.
 * This script is intentionally disabled to unblock builds.
 */

export {};

async function main() {
  console.log(
    "[backfill-stripe-subscriptions] skipped — subscription model removed"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});