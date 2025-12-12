import { neon } from "@neondatabase/serverless"
import { hash, compare } from "bcryptjs"
import { auth as authCore } from "@/auth"

function getDb() {
  return neon(process.env.DATABASE_URL!)
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash)
}

export function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function createSession(userId: number): Promise<string> {
  const sql = getDb()
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `

  return token
}

// Utility to get auth session in server components
export const auth = authCore

export async function getSession() {
  return await auth()
}

export async function deleteSession(token: string) {
  try {
    const sql = getDb()
    await sql`DELETE FROM sessions WHERE token = ${token}`
  } catch (error) {
    console.error("[v0] deleteSession error:", error)
  }
}
