import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)", opacity: 0.06 }} />
      </div>

      <div className="relative text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">404</p>
        <h1 className="text-6xl font-black tracking-tightest text-white">Page not found</h1>
        <p className="text-gray-400 max-w-sm mx-auto">
          That route doesn&apos;t exist. Head back to check today&apos;s spot prices and manage your portfolio.
        </p>
        <Link href="/" className="btn-gold inline-block">Back to home</Link>
      </div>
    </main>
  );
}
