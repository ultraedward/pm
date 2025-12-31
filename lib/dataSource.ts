export type MetalPrice = {
  metal: string;
  price: number;
  change: number;
  updatedAt: string;
};

export const DATA_SOURCE: "mock" | "live" = "mock";

export function getMockPrices(): MetalPrice[] {
  return [
    { metal: "Gold", price: 2042.35, change: 0.42, updatedAt: new Date().toISOString() },
    { metal: "Silver", price: 24.88, change: -0.31, updatedAt: new Date().toISOString() },
    { metal: "Platinum", price: 921.12, change: 0.18, updatedAt: new Date().toISOString() },
    { metal: "Palladium", price: 1012.44, change: -0.77, updatedAt: new Date().toISOString() },
  ];
}
