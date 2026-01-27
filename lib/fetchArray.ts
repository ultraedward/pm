export async function fetchArray<T>(
  url: string,
  key: string
): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const data = json?.[key];

    if (Array.isArray(data)) return data;

    console.warn(`[fetchArray] Non-array response from ${url}`, json);
    return [];
  } catch (err) {
    console.error(`[fetchArray] Failed fetch ${url}`, err);
    return [];
  }
}