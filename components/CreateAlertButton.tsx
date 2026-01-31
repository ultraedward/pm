"use client";

import { useProStatus } from "@/lib/useProStatus";

export function CreateAlertButton() {
  const { pro, loading } = useProStatus();

  if (loading) return null;

  return (
    <div>
      <button
        disabled={!pro}
        className={`rounded-md px-4 py-2 text-sm font-semibold ${
          pro
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Create Alert
      </button>

      {!pro && (
        <p className="mt-1 text-xs text-gray-500">
          Pro subscription required
        </p>
      )}
    </div>
  );
}