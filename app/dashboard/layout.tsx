// app/dashboard/layout.tsx

import NavClient from "@/app/components/NavClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <NavClient />
      <main className="max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
