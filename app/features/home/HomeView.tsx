// app/features/home/HomeView.tsx

import Card from "../../components/Card"
import { metalSnapshots } from "../../../lib/mockData"

export default function HomeView() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-4xl font-bold">Precious Metals Tracker</h2>
        <p className="text-gray-600 max-w-xl">
          Track prices, set alerts, and monitor trends across gold, silver,
          and platinum.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metalSnapshots.map((m) => (
          <Card key={m.id}>
            <div className="text-sm text-gray-500">{m.name}</div>
            <div className="text-3xl font-bold mt-1">
              ${m.price.toFixed(2)}
            </div>
            <div
              className={`text-sm mt-1 ${
                m.changePct >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {m.changePct >= 0 ? "+" : ""}
              {m.changePct}%
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
