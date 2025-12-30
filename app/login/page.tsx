// app/login/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "../components/Button"
import Card from "../components/Card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin() {
    if (email === "demo@local" && password === "demo") {
      sessionStorage.setItem("demo-authed", "true")
      router.push("/dashboard")
    } else {
      setError("Invalid demo credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card>
        <div className="space-y-4 w-80">
          <h1 className="text-2xl font-bold">Login</h1>

          <div className="space-y-2">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>

          <p className="text-xs text-gray-500">
            Demo login: <strong>demo@local</strong> / <strong>demo</strong>
          </p>
        </div>
      </Card>
    </div>
  )
}
