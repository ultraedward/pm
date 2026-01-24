"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error("Global error:", error);

  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <p>The app is still running — try again.</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}