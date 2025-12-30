import PageShell from "../components/PageShell"
import SystemView from "../features/system/SystemView"

export default function Page() {
  return (
    <PageShell title="System Status">
      <SystemView />
    </PageShell>
  )
}