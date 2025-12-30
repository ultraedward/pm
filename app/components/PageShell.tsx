// app/components/PageShell.tsx

"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Nav from "./Nav"
import DemoBanner from "./DemoBanner"

export default function PageShell({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const authed = localStorage.getItem("demo-authed")
    if (!authed && pathname !== "/login") {
      router.replace("/login")
    }
    if (authed && pathname === "/login") {
      router.replace("/dashboard")
    }
  }, [pathname, router])

  return (
    <>
      <DemoBanner />
      <Nav />
      <div className="p-10 space-y-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {children}
      </div>
    </>
  )
}
