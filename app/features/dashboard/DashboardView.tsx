// app/features/dashboard/DashboardView.tsx

"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { getDashboardData } from "../../../lib/dataSource"

export default function DashboardView() {
  const { metals, history } = getDashboardData()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metals.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border p-6 bg-white space-y-1"
          >
            <div className="text-sm text-gray-500">{m.name}</div>
            <div className="text-3xl font-bold">${m.price.toFixed(2)}</div>
            <div
              className={`text-sm font-medium ${
                m.changePct >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {m.changePct >= 0 ? "+" : ""}
              {m.changePct}%
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-6 bg-white h-[420px]">
        <h2 className="text-lg font-semibold mb-4">
          Gold — Last 24 Hours (Mock)
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis dataKey="hour" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="gold"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
