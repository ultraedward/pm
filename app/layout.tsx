import type { ReactNode } from "react"

export const metadata = {
  title: "Precious Metals Tracker",
  description: "Live precious metals prices and alerts",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  )
}
