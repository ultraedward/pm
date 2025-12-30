// app/dashboard/page.tsx

import PageShell from "../components/PageShell"
import DashboardView from "../features/dashboard/DashboardView"

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard">
      <DashboardView />
    </PageShell>
  )
}
