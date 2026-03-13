"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <html>
      <body className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
        </div>

        <div className="relative text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Error</p>
          <h1 className="text-6xl font-black tracking-tight text-white">
            Something went wrong
          </h1>
          <p className="text-gray-400 max-w-sm mx-auto">
            An unexpected error occurred. Please try again or head back home.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-black hover:bg-amber-400 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/10 px-8 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
