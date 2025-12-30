// app/features/notifications/NotificationsView.tsx

import Card from "../../components/Card"

export default function NotificationsView() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
        <p className="text-sm text-gray-500">
          You’re all caught up. Notifications will appear here when alerts are
          triggered.
        </p>
      </Card>

      <Card>
        <p className="text-sm text-gray-500">
          This page is UI-only in the current build. Real-time notifications
          will be enabled once backend alert processing is live.
        </p>
      </Card>
    </div>
  )
}
