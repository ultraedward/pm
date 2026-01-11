// app/dashboard/charts/page.tsx
// FULL SHEET
// Suspense wrapper required for useSearchParams()

import { Suspense } from "react";
import MetalChartClient from "./view";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading chart…</div>}>
      <MetalChartClient />
    </Suspense>
  );
}
