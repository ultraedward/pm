// app/dashboard/ManageSubscriptionButton.tsx
// FULL SHEET — ENSURE THIS FILE EXISTS AT THIS EXACT PATH

"use client"

export default function ManageSubscriptionButton() {
  async function openPortal() {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
    })

    const data = await res.json()

    if (data?.url) {
      window.location.href = data.url
    } else {
      alert("Unable to open billing portal.")
    }
  }

  return (
    <button
      onClick={openPortal}
      className="px-3 py-1 text-sm rounded border border-gray-600 hover:bg-gray-800"
    >
      Manage Subscription
    </button>
  )
}
