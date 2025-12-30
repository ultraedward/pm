// app/alerts/page.tsx

import PageShell from "@/app/components/PageShell"
import AlertsView from "@/app/features/alerts/AlertsView"

export default function Page() {
  return (
    <PageShell title="Alerts">
      <AlertsView />
    </PageShell>
  )
}
