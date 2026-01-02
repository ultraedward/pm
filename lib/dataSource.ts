export type MetalPrice = {
  metal: string;
  price: number;
  change: number;
  updatedAt: string;
};

export const DATA_SOURCE: "mock" | "live" =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "live" ? "live" : "mock";

export function getMockPrices(): MetalPrice[] {
  const updatedAt = new Date().toISOString();

  return [
    { metal: "Gold", price: 2042.35, change: 0.42, updatedAt },
    { metal: "Silver", price: 24.88, change: -0.31, updatedAt },
    { metal: "Platinum", price: 921.12, change: 0.18, updatedAt },
    { metal: "Palladium", price: 1012.44, change: -0.77, updatedAt },
  ];
}
