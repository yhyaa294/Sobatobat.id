import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { neon } from "@neondatabase/serverless"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { z } from "zod"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable")
}

const sql = neon(process.env.DATABASE_URL)

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(sql),
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        try {
          const result = await sql`
            SELECT id, email, name, password_hash FROM users 
            WHERE email = ${email} 
            LIMIT 1
          `

          if (result.length === 0) return null

          const user = result[0]
          const passwordMatch = await compare(password, user.password_hash)

          if (!passwordMatch) return null

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/dashboard"
    },
  },
  events: {
    async signIn({ user }) {
      console.log("[v0] User signed in:", user.email)
    },
  },
})
