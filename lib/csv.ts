export function toCSV(rows: Record<string, any>[]) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const escape = (value: any) =>
    `"${String(value ?? "")
      .replace(/"/g, '""')
      .replace(/\n/g, " ")}"`;

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escape(row[h])).join(",")
    ),
  ];

  return lines.join("\n");
}
