import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { ManageBillingButton } from "@/components/ManageBillingButton";

export default async function PricingPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-gray-400">
          Simple pricing. Upgrade anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free plan */}
        <div className="rounded-lg border border-gray-800 bg-black p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="mt-2 text-gray-400">
            Get started with basic alerts.
          </p>

          <div className="mt-6 text-3xl font-bold">$0</div>

          <ul className="mt-6 space-y-3 text-sm text-gray-300">
            <li>• Up to 3 alerts</li>
            <li>• Gold & silver tracking</li>
            <li>• Price updates</li>
          </ul>

          <div className="mt-8">
            <span className="inline-block rounded bg-gray-800 px-4 py-2 text-sm text-gray-400">
              Current plan
            </span>
          </div>
        </div>

        {/* Pro plan */}
        <div className="rounded-lg border border-blue-600 bg-gray-950 p-6">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2 text-gray-400">
            Unlimited alerts for serious tracking.
          </p>

          <div className="mt-6 text-3xl font-bold">
            $5
            <span className="text-sm text-gray-400"> / month</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-gray-300">
            <li>• Unlimited alerts</li>
            <li>• Priority updates</li>
            <li>• Future premium features</li>
          </ul>

          <div className="mt-8">
            <ManageBillingButton />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Questions?{" "}
        <Link
          href="/alerts"
          className="text-blue-400 hover:underline"
        >
          View your alerts
        </Link>
      </div>
    </div>
  );
}