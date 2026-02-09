"use client";

type Props = {
  status: {
    lastCron: any;
    activeAlerts: number;
    triggeredToday: number;
    emailCounts: Record<string, number>;
  };
  isAdmin: boolean;
};

export function DashboardStatus({ status, isAdmin }: Props) {
  const { lastCron, activeAlerts, triggeredToday, emailCounts } = status;

  async function runCron() {
    const res = await fetch("/api/admin/run-cron", {
      method: "POST",
    });

    if (!res.ok) {
      alert("Cron failed");
    } else {
      alert("Cron executed");
      window.location.reload();
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">System Status</h2>

        <div className="text-sm">
          <strong>Last Cron:</strong>{" "}
          {lastCron
            ? `${lastCron.status} @ ${new Date(
                lastCron.startedAt
              ).toLocaleString()}`
            : "Never"}
        </div>

        <div className="text-sm">
          <strong>Active Alerts:</strong> {activeAlerts}
        </div>

        <div className="text-sm">
          <strong>Triggered Today:</strong> {triggeredToday}
        </div>

        {isAdmin && (
          <button
            onClick={runCron}
            className="mt-2 px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Run Cron Now
          </button>
        )}
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Email Queue (Today)</h2>

        <div className="text-sm">
          <strong>Queued:</strong> {emailCounts.queued}
        </div>
        <div className="text-sm">
          <strong>Retry:</strong> {emailCounts.retry}
        </div>
        <div className="text-sm">
          <strong>Sent:</strong> {emailCounts.sent}
        </div>
        <div className="text-sm">
          <strong>Failed:</strong> {emailCounts.failed}
        </div>
      </div>
    </div>
  );
}