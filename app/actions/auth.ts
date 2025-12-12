"use server"

import { neon } from "@neondatabase/serverless"
import { verifyPassword, createSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signOut as authSignOut } from "@/auth"
import { hash } from "bcryptjs"

function getDb() {
  return neon(process.env.DATABASE_URL!)
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "Semua field harus diisi" }
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" }
  }

  if (!email.includes("@")) {
    return { error: "Email tidak valid" }
  }

  try {
    const sql = getDb()

    // Check if email already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return { error: "Email sudah terdaftar" }
    }

    const passwordHash = await hash(password, 10)

    await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
    `

    return { success: true }
  } catch (error) {
    console.error("[v0] Register error:", error)
    return { error: "Terjadi kesalahan. Silakan coba lagi." }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email dan password harus diisi" }
  }

  try {
    const sql = getDb()
    const users = await sql`SELECT * FROM users WHERE email = ${email}`

    if (users.length === 0) {
      return { error: "Email atau password salah" }
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return { error: "Email atau password salah" }
    }

    const token = await createSession(user.id)

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { error: "Terjadi kesalahan. Silakan coba lagi." }
  }
}

export async function logout() {
  await authSignOut({ redirect: false })
  redirect("/")
}
