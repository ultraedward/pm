export async function safeFetchArray<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Fetch failed ${res.status}: ${url}`);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error(`Expected array from ${url}, got:`, data);
      return [];
    }

    return data as T[];
  } catch (err) {
    console.error(`Fetch error ${url}:`, err);
    return [];
  }
}