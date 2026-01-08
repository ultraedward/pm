"use client";

export default function UpgradeButton() {
  const handleUpgrade = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const { url } = await res.json();

    if (url) {
      window.location.href = url;
    } else {
      alert("Failed to start checkout");
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Upgrade to Pro
    </button>
  );
}
