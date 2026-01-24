export async function safeFetchArray<T>(
  url: string,
  key: string
): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error(`${url} failed with ${res.status}`);
      return [];
    }

    const json = await res.json();

    const value = json?.[key];
    return Array.isArray(value) ? value : [];
  } catch (err) {
    console.error(`${url} exception`, err);
    return [];
  }
}