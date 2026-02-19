'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  console.error("Server Error:", error)

  return (
    <html>
      <body className="bg-black text-white p-10">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-red-400">
          {error.message}
        </p>
        <p className="mt-2 text-neutral-400">
          Digest: {error.digest}
        </p>
      </body>
    </html>
  )
}