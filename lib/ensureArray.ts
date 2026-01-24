export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  return [];
}