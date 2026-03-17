"use client";

import { useEffect } from "react";
import Link from "next/link";

// Page-level error boundary — renders inside the normal layout (with Navbar).
// For root layout failures, see global-error.tsx.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative text-center space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Error</p>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          An unexpected error occurred. Please try again or head back home.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <button onClick={reset} className="btn-gold px-8 py-3 text-sm">
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-8 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
