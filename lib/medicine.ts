// Utility functions for medicine management
import { neon } from "@neondatabase/serverless"

export function getDb() {
  return neon(process.env.DATABASE_URL!)
}

// Calculate medicine status based on expiry date
export function calculateMedicineStatus(expiryDate: string): "safe" | "expiring" | "expired" {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= 30) return "expiring"
  return "safe"
}

// Calculate days until expiry
export function calculateDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)

  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// Format date to ISO string (YYYY-MM-DD)
export function formatDateToISO(date: Date): string {
  return date.toISOString().split("T")[0]
}
