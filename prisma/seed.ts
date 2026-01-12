/**
 * Seed disabled temporarily.
 * SpotPriceCache model was removed.
 * This file must exist so Prisma/Vercel builds succeed.
 */

export async function main() {
  console.log("Seed skipped (no-op)");
}

main()
  .then(() => {
    console.log("Seed complete");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
