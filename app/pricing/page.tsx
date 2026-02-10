import { requireUser } from "@/lib/requireUser";
import Link from "next/link";

export default async function PricingPage() {
  const user = await requireUser();

  const isPro = user.subscriptionStatus === "active";
  const hasStripeCustomer = Boolean(user.stripeCustomerId);

  async function startCheckout() {
    "use server";

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/stripe/checkout`,
      { method: "POST" }
    );

    const data = await res.json();

    if (!data?.url) {
      throw new Error("Unable to start checkout");
    }

    return data.url;
  }

  async function openBillingPortal() {
    "use server";

    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/stripe/portal`,
      { method: "POST" }
    );

    const data = await res.json();

    if (!data?.url) {
      throw new Error("Unable to open billing portal");
    }

    return data.url;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="mt-2 text-gray-400">
          Simple pricing. Upgrade anytime.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* FREE PLAN */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-2 text-gray-400">
            Get started with basic alerts.
          </p>

          <p className="mt-6 text-3xl font-bold">$0</p>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li>• Up to 3 alerts</li>
            <li>• Gold & silver tracking</li>
            <li>• Price updates</li>
          </ul>

          <div className="mt-8">
            {!isPro ? (
              <span className="inline-block rounded bg-gray-800 px-4 py-2 text-sm">
                Current plan
              </span>
            ) : (
              <span className="inline-block rounded bg-gray-800 px-4 py-2 text-sm">
                Included
              </span>
            )}
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="rounded-xl border border-blue-500 bg-gray-900 p-8">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-2 text-gray-400">
            Unlimited alerts for serious tracking.
          </p>

          <p className="mt-6 text-3xl font-bold">$5 / month</p>

          <ul className="mt-6 space-y-2 text-sm text-gray-300">
            <li>• Unlimited alerts</li>
            <li>• Priority updates</li>
            <li>• Future premium features</li>
          </ul>

          <div className="mt-8">
            {isPro && hasStripeCustomer ? (
              <form
                action={async () => {
                  "use server";
                  const url = await openBillingPortal();
                  return { redirect: url };
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-200"
                >
                  Manage Billing
                </button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  const url = await startCheckout();
                  return { redirect: url };
                }}
              >
                <button
                  type="submit"
                  className="w-full rounded bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
                >
                  Upgrade to Pro
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400">
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