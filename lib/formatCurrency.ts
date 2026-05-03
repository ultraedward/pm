/**
 * Currency formatting — the single place where numbers become money strings.
 *
 * Use this everywhere instead of toLocaleString("en-US", { currency: "USD" }).
 * Handles locale selection automatically so amounts look native to each currency.
 */

const LOCALE_MAP: Record<string, string> = {
  USD: "en-US",
  AUD: "en-AU",
  CAD: "en-CA",
  GBP: "en-GB",
  EUR: "de-DE",
};

/**
 * Formats a number as a currency string.
 *
 * @example
 * formatCurrency(4830)          // "$4,830.00"  (USD default)
 * formatCurrency(7487, "AUD")   // "A$7,487.00"
 * formatCurrency(3815, "GBP")   // "£3,815.00"
 * formatCurrency(4432, "EUR")   // "4.432,00 €"
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  const locale = LOCALE_MAP[currency] ?? "en-US";
  return amount.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Like formatCurrency but rounds to whole numbers — useful for large values
 * where cents add noise (e.g. portfolio totals, gold prices).
 *
 * @example
 * formatCurrencyWhole(4830.67, "USD")  // "$4,831"
 */
export function formatCurrencyWhole(amount: number, currency: string = "USD"): string {
  const locale = LOCALE_MAP[currency] ?? "en-US";
  return amount.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
