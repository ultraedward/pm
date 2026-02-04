"use client";

import { fetchJsonArray } from "@/lib/fetchJsonArray";

type PriceRow = {
  metal: string;
  price: number;
  timestamp: string;
};

export default async function PricesPage() {
  const prices = await fetchJsonArray<PriceRow>("/api/prices");

  return (
    <div>
      <h1>Prices</h1>

      {prices.length === 0 ? (
        <p>No price data available.</p>
      ) : (
        <ul>
          {prices.slice(0, 50).map((p, i) => (
            <li key={i}>
              {p.metal} — ${p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}