/**
 * Safe JSON fetcher that ALWAYS returns an array.
 * - Handles 500s
 * - Handles non-JSON
 * - Handles object responses
 * - Prevents `.slice()` crashes forever
 */
export async function fetchJsonArray<T = any>(
  url: string,
  options?: RequestInit
): Promise<T[]> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
    });

    if (!res.ok) {
      console.error(`[fetchJsonArray] ${url} → ${res.status}`);
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray((data as any)?.data)) return (data as any).data;
    if (Array.isArray((data as any)?.prices)) return (data as any).prices;
    if (Array.isArray((data as any)?.alerts)) return (data as any).alerts;

    return [];
  } catch (err) {
    console.error(`[fetchJsonArray] ${url} failed`, err);
    return [];
  }
}