"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateAlertForm() {
  const router = useRouter();
  const [metal, setMetal] = useState("gold");
  const [direction, setDirection] = useState("above");
  const [price, setPrice] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/alerts/create", {
      method: "POST",
      body: JSON.stringify({ metal, direction, price }),
    });

    if (res.status === 402) {
      const checkout = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await checkout.json();
      window.location.href = data.url;
      return;
    }

    router.push("/alerts");
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <select value={metal} onChange={e => setMetal(e.target.value)}>
        <option value="gold">Gold</option>
        <option value="silver">Silver</option>
      </select>

      <select
        value={direction}
        onChange={e => setDirection(e.target.value)}
      >
        <option value="above">Above</option>
        <option value="below">Below</option>
      </select>

      <input
        type="number"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
      />

      <button type="submit" className="border px-4 py-2">
        Create Alert
      </button>
    </form>
  );
}