import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

type Trigger = {
  id: string;
  metal: string;
  price: number;
  triggeredAt: string;
  alert: {
    target: number;
    direction: "above" | "below";
  };
};

export default async function AlertActivityPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/alerts/history`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="text-red-400">
        Failed to load alert history
      </div>
    );
  }

  const { history }: { history: Trigger[] } = await res.json();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Alert Activity</h1>

      {history.length === 0 && (
        <div className="text-gray-400">
          No alerts have triggered yet.
        </div>
      )}

      <div className="space-y-3">
        {history.map((t) => (
          <div
            key={t.id}
            className="border border-gray-800 rounded p-4 flex justify-between"
          >
            <div>
              <div className="font-medium">
                {t.metal.toUpperCase()} alert triggered
              </div>

              <div className="text-sm text-gray-400">
                Price {t.alert.direction} ${t.alert.target.toFixed(2)}
              </div>

              <div className="text-sm">
                Triggered at{" "}
                {new Date(t.triggeredAt).toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">
                ${t.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                Price at trigger
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}