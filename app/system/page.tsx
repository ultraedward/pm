import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const status = await prisma.cronStatus.findUnique({
    where: { name: "price-engine" },
  });

  const stale =
    !status ||
    Date.now() - status.lastRun.getTime() > 10 * 60 * 1000;

  return (
    <main className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>

      <div className="border border-gray-800 rounded-xl p-6 bg-gray-900 max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">
            Price Engine
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              stale ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {stale ? "Stale / Error" : "Healthy"}
          </span>
        </div>

        <div className="text-sm text-gray-400 space-y-2">
          <div>
            Last Run:{" "}
            {status
              ? status.lastRun.toLocaleString()
              : "Never"}
          </div>
          <div>
            Message: {status?.message ?? "—"}
          </div>
        </div>
      </div>
    </main>
  );
}
