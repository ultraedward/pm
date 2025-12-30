export default function StatBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="panel-soft px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
