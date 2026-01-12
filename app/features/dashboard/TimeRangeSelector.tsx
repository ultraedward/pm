"use client";

type Range = 24 | 168 | 720;

export default function TimeRangeSelector({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  const ranges: { label: string; value: Range }[] = [
    { label: "24h", value: 24 },
    { label: "7d", value: 168 },
    { label: "30d", value: 720 },
  ];

  return (
    <div className="inline-flex rounded border overflow-hidden">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-3 py-1 text-sm ${
            value === r.value
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
