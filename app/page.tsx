import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // 🔒 If logged in → go to dashboard cleanly
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HERO */}
      <section className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          Precious Metals Alerts
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Real-time gold and silver tracking with intelligent alerts.
          Move when price action matters.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/pricing"
            className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 px-6 py-3 text-gray-300 transition hover:bg-gray-900"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="border-t border-gray-900 bg-black py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <Feature
            title="Live Pricing"
            desc="Track gold (XAU) and silver (XAG) in real-time."
          />
          <Feature
            title="Smart Alerts"
            desc="Price-based and percent-based alert triggers."
          />
          <Feature
            title="Pro Tools"
            desc="Unlimited alerts with priority email delivery."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-700">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-gray-400">{desc}</p>
    </div>
  );
}