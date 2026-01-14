// app/dashboard/alerts/alert-actions.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AlertActions({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/alerts/${id}`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    const confirmed = confirm("Delete this alert?");
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={toggle}
        className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
      >
        {active ? "Pause" : "Resume"}
      </button>

      <button
        disabled={loading}
        onClick={remove}
        className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
