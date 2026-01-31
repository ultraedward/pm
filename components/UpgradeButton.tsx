"use client";

export function UpgradeButton() {
  return (
    <button
      onClick={() => {
        window.location.href = "/api/stripe/checkout";
      }}
      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
    >
      Upgrade to Pro
    </button>
  );
}