export const dynamic = "force-dynamic";

type AlertHistoryItem = {
  id: string;
  metal?: string | null;
  target?: number | null;
  direction?: "above" | "below" | null;
  sentTo?: string | null;
  status?: "sent" | "failed" | "skipped" | string | null;
  createdAt?: string | null;
};

async function getHistory(): Promise<AlertHistoryItem[]> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/alerts/history`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return Array.isArray(data.history) ? data.history : [];
}

function StatusBadge({ status }: { status?: string | null }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

  switch (status) {
    case "sent":
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-400`}>
          Sent
        </span>
      );
    case "failed":
      return (
        <span className={`${base} bg-red-500/10 text-red-400`}>
          Failed
        </span>
      );
    case "skipped":
      return (
        <span className={`${base} bg-yellow-500/10 text-yellow-400`}>
          Skipped
        </span>
      );
    default:
      return (
        <span className={`${base} bg-neutral-700/40 text-neutral-300`}>
          Unknown
        </span>
      );
  }
}

export default async function AlertsActivityPage() {
  const history = await getHistory();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alert Activity</h1>

      {history.length === 0 ? (
        <div className="rounded-md border border-neutral-800 p-6 text-neutral-400">
          No alerts have been triggered yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left">Metal</th>
                <th className="px-4 py-3 text-left">Condition</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="border-t border-neutral-800 hover:bg-neutral-900"
                >
                  <td className="px-4 py-3 capitalize">
                    {h.metal ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    {h.direction
                      ? h.direction === "above"
                        ? "Above"
                        : "Below"
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {typeof h.target === "number"
                      ? `$${h.target.toLocaleString()}`
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    {h.sentTo ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={h.status} />
                  </td>

                  <td className="px-4 py-3 text-neutral-400">
                    {h.createdAt
                      ? new Date(h.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}