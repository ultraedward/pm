"use client"

import { useState } from "react"
import Card from "../../components/Card"
import Button from "../../components/Button"

type Alert = {
  id: string
  metal: string
  condition: string
}

export default function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metal, setMetal] = useState("Gold")
  const [condition, setCondition] = useState("> 2300")

  function addAlert() {
    if (!condition.trim()) return
    setAlerts([
      ...alerts,
      { id: crypto.randomUUID(), metal, condition }
    ])
    setCondition("")
  }

  function removeAlert(id: string) {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Create Alert</h2>
          <div className="flex gap-3">
            <select
              className="border rounded px-3 py-2"
              value={metal}
              onChange={(e) => setMetal(e.target.value)}
            >
              <option>Gold</option>
              <option>Silver</option>
              <option>Platinum</option>
            </select>
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Condition (e.g. > 2300)"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
            <Button onClick={addAlert}>Add</Button>
          </div>
        </div>
      </Card>

      {alerts.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">No alerts yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.metal}</div>
                  <div className="text-sm text-gray-500">
                    Condition: {a.condition}
                  </div>
                </div>
                <Button variant="danger" onClick={() => removeAlert(a.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
