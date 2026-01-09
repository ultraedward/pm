"use client"

export default function ManageSubscriptionButton() {
  async function openPortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Unable to open billing portal")
    }
  }

  return (
    <button
      onClick={openPortal}
      className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
    >
      Manage subscription
    </button>
  )
}
