"use client";

import { useState } from "react";
import { SUPPORTED_CURRENCIES, CURRENCY_LABELS, CURRENCY_SYMBOLS, type SupportedCurrency } from "@/lib/fx";

interface Props {
  current: string;
}

export function CurrencyPicker({ current }: Props) {
  const [selected, setSelected] = useState<SupportedCurrency>(
    (SUPPORTED_CURRENCIES as readonly string[]).includes(current)
      ? (current as SupportedCurrency)
      : "USD"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(currency: SupportedCurrency) {
    if (currency === selected && saved) return;
    setSelected(currency);
    setSaving(true);
    setSaved(false);

    await fetch("/api/account/currency", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SUPPORTED_CURRENCIES.map((c) => {
          const isActive = selected === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => save(c)}
              disabled={saving}
              aria-pressed={isActive}
              className={`flex items-center justify-between rounded-xl border px-4 min-h-[44px] text-sm transition-all disabled:opacity-50 ${
                isActive
                  ? "border-amber-500/40 bg-amber-500/10 text-white"
                  : "border-white/5 bg-black text-gray-500 hover:border-white/10 hover:text-gray-300"
              }`}
            >
              <span className="font-semibold shrink-0">{c}</span>
              <span className="text-xs text-gray-500 truncate ml-3">
                {CURRENCY_SYMBOLS[c]} · {CURRENCY_LABELS[c]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline feedback — no toast library needed */}
      <p className="h-4 text-xs text-gray-500">
        {saving && "Saving…"}
        {saved && !saving && "✓ Saved"}
      </p>
    </div>
  );
}
