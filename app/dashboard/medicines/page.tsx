import { getMedicines } from "@/app/actions/medicine"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MedicineCabinetClient } from "@/components/medicine-cabinet-client"

export const metadata = {
  title: "Kabinet Obat Digital - SobatObat.ai",
  description: "Kelola persediaan obat Anda dengan aman dan terorganisir",
}

export default async function MedicinesPage() {
  // Check authentication
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  // Fetch medicines data
  const response = await getMedicines()

  if (!response.success) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
          {response.message}
        </div>
      </div>
    )
  }

  return <MedicineCabinetClient initialMedicines={response.data || []} />
}
