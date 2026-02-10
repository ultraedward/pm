import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { openBillingPortal } from "@/lib/stripe/openBillingPortal";

export default async function PricingPage() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      subscriptionStatus: true,
      stripeCustomerId: true,
    },
  });

  const isPro = dbUser?.subscriptionStatus === "active";
  const hasStripeCustomer = Boolean(dbUser?.stripeCustomerId);

  async function upgradeAction() {
    "use server";
    const url = await createCheckoutSession();
    redirect(url);
  }

  async function manageBillingAction() {
    "use server";
    const url = await openBillingPortal();
    redirect(url);
  }

  return (
    <div className="mx-auto max-w-3xl p-8 space-y-10">
      <h1 className="text-4xl font-bold">Pricing</h1>

      {/* FREE PLAN */}
      <div className="rounded-lg border border-gray-800 p-6 bg-gray-900 space-y-4">
        <h2 className="text-2xl font-semibold">Free</h2>
        <p className="text-gray-400">Get started with basic alerts.</p>
        <ul className="list-disc pl-6 text-sm text-gray-300">
          <li>Up to 3 alerts</li>
          <li>Gold & silver tracking</li>
          <li>Price updates</li>
        </ul>

        {!isPro && (
          <div className="text-sm text-green-400 font-medium">
            Current plan
          </div>
        )}
      </div>

      {/* PRO PLAN */}
      <div className="rounded-lg border border-gray-800 p-6 bg-gray-900 space-y-4">
        <h2 className="text-2xl font-semibold">Pro</h2>
        <p className="text-gray-400">Unlimited alerts for serious tracking.</p>
        <div className="text-3xl font-bold">$5 / month</div>

        <ul className="list-disc pl-6 text-sm text-gray-300">
          <li>Unlimited alerts</li>
          <li>Priority updates</li>
          <li>Future premium features</li>
        </ul>

        {isPro && hasStripeCustomer ? (
          <form action={manageBillingAction}>
            <button
              type="submit"
              className="rounded bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-200"
            >
              Manage Billing
            </button>
          </form>
        ) : (
          <form action={upgradeAction}>
            <button
              type="submit"
              className="rounded bg-white px-5 py-2 text-sm font-medium text-black hover:bg-gray-200"
            >
              Upgrade to Pro
            </button>
          </form>
        )}
      </div>
    </div>
  );
}