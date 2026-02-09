"use client";

export function ManageBillingButton() {
  async function openPortal() {
    const res = await fetch("/api/billing/portal", {
      method: "POST",
    });

    if (!res.ok) {
      alert("Unable to open billing portal");
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <button
      onClick={openPortal}
      className="px-4 py-2 border rounded hover:bg-gray-800"
    >
      Manage Billing
    </button>
  );
}