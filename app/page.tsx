import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Precious Metals Tracker</h1>

      <div className="space-x-6">
        <Link href="/prices" className="underline">
          Prices
        </Link>
        <Link href="/alerts" className="underline">
          Alerts
        </Link>
      </div>
    </div>
  );
}