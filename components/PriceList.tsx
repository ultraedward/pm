type PricePoint = {
  price: number;
  time: Date;
};

export function PriceList({
  title,
  prices,
}: {
  title: string;
  prices: PricePoint[];
}) {
  if (prices.length === 0) {
    return (
      <div className="rounded border border-gray-800 p-4 text-sm text-gray-400">
        No price data yet.
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-800 p-4 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      <ul className="space-y-1 text-sm">
        {prices.slice(0, 10).map((p, i) => (
          <li key={i} className="flex justify-between">
            <span>${p.price}</span>
            <span className="text-gray-400">
              {p.time.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}