import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">404</p>
        <h1 className="text-6xl font-black tracking-tight text-white">
          Page not found
        </h1>
        <p className="text-gray-400 max-w-sm mx-auto">
          That route doesn&apos;t exist. Head back to track live spot prices and manage your portfolio.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
