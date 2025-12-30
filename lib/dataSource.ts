// lib/dataSource.ts

import { metalSnapshots, mockHistory } from "./mockData"

export const UI_ONLY_MODE = true

export function getDashboardData() {
  if (UI_ONLY_MODE) {
    return {
      metals: metalSnapshots,
      history: mockHistory
    }
  }

  throw new Error("Backend not enabled")
}
