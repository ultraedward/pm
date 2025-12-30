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

  // Real backend will plug in here later
  // return fetch("/api/dashboard").then(res => res.json())

  throw new Error("Backend not enabled")
}
