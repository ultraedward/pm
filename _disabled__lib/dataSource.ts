// /lib/dataSource.ts

export type DataSource = "simulated" | "live";

/**
 * IMPORTANT:
 * - live is NOT enabled yet
 * - this is a preparatory flag only
 */
export const DATA_SOURCE: DataSource =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "live"
    ? "live"
    : "simulated";
