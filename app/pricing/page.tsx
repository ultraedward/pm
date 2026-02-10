import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-gray-400">
          Simple, transparent pricing for precious metals alerts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded border border-gray-800 bg-gray-900 p-6 space-y-4">
          <h2 className="text-xl font-semibold">Free</h2>

          <p className="text-3xl font-bold">$0</p>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Up to 3 active alerts</li>
            <li>• Gold & Silver prices</li>
            <li>• Email notifications</li>
          </ul>

          <p className="text-sm text-gray-400">
            Perfect for casual tracking.
          </p>
        </div>

        {/* Pro Plan */}
        <div className="rounded border border-white bg-black p-6 space-y-4">
          <h2 className="text-xl font-semibold">Pro</h2>

          <p className="text-3xl font-bold">$9 / month</p>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Unlimited alerts</li>
            <li>• Priority price checks</li>
            <li>• Faster notifications</li>
          </ul>

          <Link
            href="/api/billing/checkout"
            className="inline-block rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}