"use client";

type Props = {
  metal: string;
  onChange: (metal: string) => void;
};

const METALS = ["gold", "silver", "platinum", "palladium"];

export default function MetalSelector({ metal, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {METALS.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1 rounded text-sm border ${
            metal === m
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
