// lib/auth.ts

export type User = {
  id: string
  role: "ADMIN" | "USER"
}

export async function getCurrentUser(): Promise<User | null> {
  return null
}
