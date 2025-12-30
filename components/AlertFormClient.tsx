"use client";

import { useState } from "react";

type Metal = {
  id: string;
  name: string;
};

export default function AlertFormClient({ metals }: { metals: Metal[] }) {
  const [metalId, setMetalId] = useState(metals[0]?.id);
  const [condition, setCondition] = useState("ABOVE");
  const [targetPrice, setTargetPrice] = useState("");

  async function submit() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metalId, condition, targetPrice }),
    });

    location.reload();
  }

  return (
    <div className="border border-gray-800 rounded-xl p-6 bg-gray-900 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Alert</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="bg-black border border-gray-700 p-2 rounded"
          value={metalId}
          onChange={(e) => setMetalId(e.target.value)}
        >
          {metals.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className="bg-black border border-gray-700 p-2 rounded"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="ABOVE">Above</option>
          <option value="BELOW">Below</option>
        </select>

        <input
          type="number"
          placeholder="Target price"
          className="bg-black border border-gray-700 p-2 rounded"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-white text-black rounded px-4 py-2 font-semibold"
        >
          Add Alert
        </button>
      </div>
    </div>
  );
}
