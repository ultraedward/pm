import { redirect } from "next/navigation";

// Canonical alerts page lives at /dashboard/alerts
// This route exists for backwards-compat and navbar links
export default function AlertsPage() {
  redirect("/dashboard/alerts");
}
