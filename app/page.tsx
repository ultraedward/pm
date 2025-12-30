// app/page.tsx

import PageShell from "./components/PageShell"
import HomeView from "./features/home/HomeView"

export default function Page() {
  return (
    <PageShell title="Home">
      <HomeView />
    </PageShell>
  )
}
