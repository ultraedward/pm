"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-sm opacity-70">
              A client-side rendering error occurred.
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 border rounded"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
