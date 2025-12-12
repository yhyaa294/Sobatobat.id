"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Pill, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
        setIsLoading(false)
      } else if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 mt-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
              <Pill className="w-8 h-8 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-1">SobatObat.ai</h1>
          <p className="text-sm text-muted-foreground">Asisten Apoteker Pribadi Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
              {error}
            </div>
          )}

          {/* Email Input - Mobile optimized */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 text-base bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input - Mobile optimized */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 text-base bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button - Instant visual feedback */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-12 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>
          <div className="border-t border-border pt-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
