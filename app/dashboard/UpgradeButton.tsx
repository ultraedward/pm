"use client"

export default function UpgradeButton() {
  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Checkout error:", text)
        alert("Stripe checkout failed. Check server logs.")
        return
      }

      const data = await res.json()

      if (!data.url) {
        alert("No checkout URL returned")
        return
      }

      window.location.href = data.url
    } catch (err) {
      console.error(err)
      alert("Unexpected error starting checkout")
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      Upgrade
    </button>
  )
}
