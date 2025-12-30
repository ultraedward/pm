// app/components/StatBadge.tsx
export default function StatBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}
