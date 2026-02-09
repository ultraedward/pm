export function SystemStatus({ status }: { status: any }) {
  const { lastCron, priceStats, alertCount, triggeredToday } = status

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">System Status</h3>

      <div className="text-sm">
        <strong>Last Cron:</strong>{" "}
        {lastCron
          ? `${lastCron.status} @ ${new Date(
              lastCron.startedAt
            ).toLocaleTimeString()}`
          : "Never"}
      </div>

      <div className="text-sm">
        <strong>Active Alerts:</strong> {alertCount}
      </div>

      <div className="text-sm">
        <strong>Triggered Today:</strong> {triggeredToday}
      </div>

      <div className="text-sm space-y-1">
        {priceStats.map((p: any) => (
          <div key={p.metal}>
            <strong>{p.metal}:</strong>{" "}
            {p._max.timestamp
              ? `updated ${new Date(
                  p._max.timestamp
                ).toLocaleTimeString()}`
              : "no data"}
          </div>
        ))}
      </div>
    </div>
  )
}