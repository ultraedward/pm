export type RangeKey = "24h" | "7d" | "30d";

const HOURS_BY_RANGE: Record<RangeKey, number> = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
};

type Point = { t: number; gold: number; silver: number; platinum: number };

export function generateMockPrices(range: RangeKey): Point[] {
  const hours = HOURS_BY_RANGE[range];
  const now = Date.now();

  let gold = 2050;
  let silver = 24.5;
  let platinum = 950;

  const data: Point[] = [];

  for (let i = hours; i >= 0; i--) {
    gold += (Math.random() - 0.5) * 8;
    silver += (Math.random() - 0.5) * 0.25;
    platinum += (Math.random() - 0.5) * 6;

    data.push({
      t: now - i * 60 * 60 * 1000,
      gold: Number(gold.toFixed(2)),
      silver: Number(silver.toFixed(2)),
      platinum: Number(platinum.toFixed(2)),
    });
  }

  return data;
}
