// app/features/system/SystemView.tsx

import Card from "../../components/Card"

export default function SystemView() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Price Engine</div>
            <div className="text-sm text-gray-500">
              Simulated price updates (UI-only)
            </div>
          </div>
          <span className="text-sm font-medium text-green-600">Healthy</span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Alerts Engine</div>
            <div className="text-sm text-gray-500">
              Mock alert evaluation
            </div>
          </div>
          <span className="text-sm font-medium text-yellow-600">
            Standby
          </span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Email Delivery</div>
            <div className="text-sm text-gray-500">
              Disabled in UI-first mode
            </div>
          </div>
          <span className="text-sm font-medium text-gray-400">
            Disabled
          </span>
        </div>
      </Card>
    </div>
  )
}
