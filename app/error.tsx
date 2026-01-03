"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
          <div className="max-w-lg w-full border rounded-xl p-6 space-y-4">
            <h1 className="text-xl font-semibold">
              Something went wrong
            </h1>

            <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
              {error.message}
            </pre>

            {error.digest && (
              <div className="text-xs text-gray-500">
                Digest: {error.digest}
              </div>
            )}

            <button
              onClick={reset}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
