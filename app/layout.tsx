export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import "./globals.css";
import NavClient from "@/app/components/NavClient";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavClient />
        {children}
      </body>
    </html>
  );
}
