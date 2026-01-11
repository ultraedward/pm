// app/cron-status/page.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CronStatusPage() {
  const runs = await prisma.cronRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Cron Health</h1>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.name}</td>
              <td
                className={`p-2 border ${
                  r.status === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {r.status}
              </td>
              <td className="p-2 border">{r.message}</td>
              <td className="p-2 border">
                {r.createdAt.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
