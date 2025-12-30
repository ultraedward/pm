// app/components/Nav.tsx

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/alerts", label: "Alerts" },
  { href: "/history", label: "History" },
  { href: "/notifications", label: "Notifications" },
  { href: "/system", label: "System" }
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    localStorage.removeItem("demo-authed")
    localStorage.removeItem("demo-redirect")
    router.push("/login")
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold tracking-tight">Precious Metals</span>

          <div className="flex gap-4 text-sm">
            {links.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`pb-1 border-b-2 transition ${
                    active
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>

        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-black"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
