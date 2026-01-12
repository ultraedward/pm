export type Metal = "gold" | "silver" | "platinum";

export type PricePoint = {
  t: number;
  price: number;
};

export function generateMockPrices(
  metal: Metal,
  hours = 24
): PricePoint[] {
  const base =
    metal === "gold" ? 2050 :
    metal === "silver" ? 25 :
    950;

  const points: PricePoint[] = [];
  let price = base;

  for (let i = hours; i >= 0; i--) {
    price += (Math.random() - 0.5) * base * 0.002;
    points.push({
      t: Date.now() - i * 60 * 60 * 1000,
      price: Number(price.toFixed(2)),
    });
  }

  return points;
}
