// app/notifications/page.tsx

import PageShell from "../components/PageShell"
import NotificationsView from "../features/notifications/NotificationsView"

export default function Page() {
  return (
    <PageShell title="Notifications">
      <NotificationsView />
    </PageShell>
  )
}
