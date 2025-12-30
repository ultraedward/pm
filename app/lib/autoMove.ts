// app/lib/autoMove.ts

export async function autoMovePrices() {
  await fetch("/api/cron/move-prices", { cache: "no-store" })
}
