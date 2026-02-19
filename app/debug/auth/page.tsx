// FULL FILE — COPY / PASTE

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthDebugPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Auth Debug</h1>

      <div className="bg-blue-900/40 p-6 rounded-lg">
        <p className="mb-2 font-semibold">Session:</p>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </main>
  );
}