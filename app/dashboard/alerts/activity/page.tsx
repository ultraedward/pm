export const dynamic = "force-dynamic";

type AlertHistoryItem = {
  id: string;
  metal: string;
  target: number;
  direction: "above" | "below";
  sentTo: string;
  status: string;
  createdAt: string;
};

async function getHistory(): Promise<AlertHistoryItem[]> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/alerts/history`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.history ?? [];
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
                  <td className="px-4 py-3 capitalize">{h.metal}</td>
                  <td className="px-4 py-3">
                    {h.direction === "above" ? "Above" : "Below"}
                  </td>
                  <td className="px-4 py-3">${h.target.toLocaleString()}</td>
                  <td className="px-4 py-3">{h.sentTo}</td>
                  <td className="px-4 py-3 capitalize">{h.status}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(h.createdAt).toLocaleString()}
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