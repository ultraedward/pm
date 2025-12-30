// app/alerts/page.tsx

import PageShell from "@/components/PageShell"
import AlertsView from "@/features/alerts/AlertsView"

export default function Page() {
  return (
    <PageShell title="Alerts">
      <AlertsView />
    </PageShell>
  )
}
