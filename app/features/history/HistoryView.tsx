// app/features/history/HistoryView.tsx

import Card from "../../components/Card"
import { metalSnapshots } from "../../../lib/mockData"

export default function HistoryView() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold mb-4">Recent Prices (Mock)</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Metal</th>
                <th className="py-2">Price</th>
                <th className="py-2">Change</th>
                <th className="py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {metalSnapshots.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{m.name}</td>
                  <td className="py-2">${m.price.toFixed(2)}</td>
                  <td
                    className={`py-2 ${
                      m.changePct >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.changePct >= 0 ? "+" : ""}
                    {m.changePct}%
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date().toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-gray-500">
          This table uses mock data in UI-first mode. Historical records will
          appear here once backend storage is enabled.
        </p>
      </Card>
    </div>
  )
}
