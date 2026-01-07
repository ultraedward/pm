export const dynamic = "force-dynamic";

async function getPrices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/dashboard/prices`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function PriceHeader() {
  const prices = await getPrices();

  if (!prices?.length) return null;

  return (
    <div className="flex gap-6 mb-6">
      {prices.map((p: any) => (
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
