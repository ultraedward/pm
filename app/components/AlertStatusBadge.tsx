type AlertStatus = "waiting" | "triggered" | "inactive";

const styles: Record<AlertStatus, string> = {
  waiting:
    "bg-yellow-100 text-yellow-800 border border-yellow-300",
  triggered:
    "bg-red-100 text-red-800 border border-red-300",
  inactive:
    "bg-gray-100 text-gray-700 border border-gray-300",
};

export default function AlertStatusBadge({
  status,
}: {
  status: AlertStatus;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
