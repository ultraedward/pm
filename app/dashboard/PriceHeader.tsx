"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PriceHeader() {
  const { data } = useSWR("/api/dashboard/prices", fetcher);

  if (!data?.prices) return null;

  return (
    <div className="flex gap-6 mb-6">
      {data.prices.map((p: any) => (
        <div
          key={p.id}
          className="rounded-lg bg-black text-white px-5 py-3 min-w-[140px]"
        >
          <div className="text-xs uppercase opacity-70">{p.metal}</div>
          <div className="text-xl font-semibold">
            ${Number(p.price).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
