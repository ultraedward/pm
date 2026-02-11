import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black opacity-60" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-6xl px-8 pt-28 pb-20">

        {/* HERO */}
        <section className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span className="block">Precious Metals.</span>
            <span className="block bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              Under Control.
            </span>
          </h1>

          <p className="max-w-xl text-lg text-neutral-400">
            Track gold and silver prices in real time.  
            Set alerts. Move when it matters.
          </p>

          <div className="flex gap-4 pt-4">
            <Link
              href="/alerts/new"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:scale-105 transition"
            >
              Create Alert
            </Link>

            <Link
              href="/alerts"
              className="rounded-full border border-neutral-700 px-6 py-3 text-sm text-white hover:bg-neutral-900 transition"
            >
              View Alerts
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-2">
            <div className="text-xs tracking-widest text-neutral-500">
              GOLD
            </div>
            <div className="text-5xl font-semibold">$2045.12</div>
            <div className="text-neutral-500 text-sm">
              Latest market price
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs tracking-widest text-neutral-500">
              SILVER
            </div>
            <div className="text-5xl font-semibold">$24.87</div>
            <div className="text-neutral-500 text-sm">
              Latest market price
            </div>
          </div>
        </section>

        {/* FOOTER BAR */}
        <section className="mt-24 border-t border-neutral-800 pt-10 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          
          <div>
            <div className="text-xs tracking-widest text-neutral-500">
              PLAN
            </div>
            <div className="text-2xl font-semibold">
              FREE
            </div>
          </div>

          <div>
            <div className="text-xs tracking-widest text-neutral-500">
              ACTIVE ALERTS
            </div>
            <div className="text-2xl font-semibold">
              0
            </div>
          </div>

          <div className="md:text-right">
            <Link
              href="/pricing"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:scale-105 transition"
            >
              Upgrade to Pro
            </Link>
          </div>

        </section>
      </div>
    </main>
  );
}