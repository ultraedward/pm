import "./globals.css";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import NavClient from "@/app/components/NavClient";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavClient />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
