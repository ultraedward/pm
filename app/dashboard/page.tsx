export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">

        <h1 className="text-2xl font-bold">Auth Debug</h1>

        <div className="rounded bg-gray-900 p-4">
          <p className="text-sm text-gray-400">Session:</p>
          <pre className="mt-2 text-xs">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {session?.user?.email && (
          <div className="rounded bg-gray-900 p-4">
            <p className="text-sm text-gray-400">DB User Lookup:</p>
            <pre className="mt-2 text-xs">
              {JSON.stringify(
                await prisma.user.findUnique({
                  where: { email: session.user.email },
                }),
                null,
                2
              )}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}