// app/history/page.tsx

import PageShell from "../components/PageShell"
import HistoryView from "../features/history/HistoryView"

export default function Page() {
  return (
    <PageShell title="History">
      <HistoryView />
    </PageShell>
  )
}
