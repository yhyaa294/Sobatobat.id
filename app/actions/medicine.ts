"use server"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { addMedicineSchema, type AddMedicineInput } from "@/lib/medicine-validation"
import { calculateMedicineStatus, calculateDaysUntilExpiry, getDb } from "@/lib/medicine"
import type { Medicine, MedicineResponse, ActionResponse } from "@/types"
import { z } from "zod" // Import z for type checking in addMedicine

// Add a new medicine
export async function addMedicine(input: AddMedicineInput): Promise<ActionResponse<Medicine>> {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please login first.",
      }
    }

    // Validate input using Zod
    const validatedData = addMedicineSchema.parse(input)

    const sql = getDb()

    // Insert medicine into database
    const result = await sql`
      INSERT INTO medicines (
        user_id,
        name,
        dosage,
        frequency,
        expiry_date,
        stock,
        notes
      )
      VALUES (
        ${session.userId},
        ${validatedData.name},
        ${validatedData.dosage || null},
        ${validatedData.frequency || null},
        ${validatedData.expiry_date},
        ${validatedData.stock},
        ${validatedData.notes || null}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        message: "Gagal menambahkan obat.",
      }
    }

    // Revalidate cache
    revalidatePath("/dashboard/medicines")

    return {
      success: true,
      message: "Obat berhasil ditambahkan.",
      data: result[0] as Medicine,
    }
  } catch (error) {
    console.error("[v0] addMedicine error:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldError = error.errors[0]
      return {
        success: false,
        message: fieldError.message,
      }
    }

    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}

// Get all medicines for current user
export async function getMedicines(): Promise<ActionResponse<MedicineResponse[]>> {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please login first.",
      }
    }

    const sql = getDb()

    // Fetch medicines sorted by expiry date (nearest first)
    const medicines = await sql`
      SELECT *
      FROM medicines
      WHERE user_id = ${session.userId}
      ORDER BY expiry_date ASC
    `

    // Transform data with calculated status
    const transformedMedicines: MedicineResponse[] = (medicines as Medicine[]).map((medicine) => ({
      id: medicine.id,
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      expiry_date: medicine.expiry_date,
      stock: medicine.stock,
      notes: medicine.notes,
      created_at: medicine.created_at,
      updated_at: medicine.updated_at,
      status: calculateMedicineStatus(medicine.expiry_date),
      daysUntilExpiry: calculateDaysUntilExpiry(medicine.expiry_date),
    }))

    return {
      success: true,
      message: "Berhasil mengambil data obat.",
      data: transformedMedicines,
    }
  } catch (error) {
    console.error("[v0] getMedicines error:", error)
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}

// Delete a medicine by ID
export async function deleteMedicine(id: number): Promise<ActionResponse> {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please login first.",
      }
    }

    const sql = getDb()

    // Verify ownership before deleting
    const medicine = await sql`
      SELECT user_id FROM medicines WHERE id = ${id}
    `

    if (medicine.length === 0) {
      return {
        success: false,
        message: "Obat tidak ditemukan.",
      }
    }

    if (medicine[0].user_id !== session.userId) {
      return {
        success: false,
        message: "Unauthorized. You don't have permission to delete this medicine.",
      }
    }

    // Delete medicine
    await sql`DELETE FROM medicines WHERE id = ${id} AND user_id = ${session.userId}`

    // Revalidate cache
    revalidatePath("/dashboard/medicines")

    return {
      success: true,
      message: "Obat berhasil dihapus.",
    }
  } catch (error) {
    console.error("[v0] deleteMedicine error:", error)
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}

// Update medicine stock
export async function updateMedicineStock(id: number, newStock: number): Promise<ActionResponse<Medicine>> {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please login first.",
      }
    }

    if (newStock < 0) {
      return {
        success: false,
        message: "Stok tidak boleh negatif.",
      }
    }

    const sql = getDb()

    // Verify ownership before updating
    const medicine = await sql`
      SELECT user_id FROM medicines WHERE id = ${id}
    `

    if (medicine.length === 0) {
      return {
        success: false,
        message: "Obat tidak ditemukan.",
      }
    }

    if (medicine[0].user_id !== session.userId) {
      return {
        success: false,
        message: "Unauthorized. You don't have permission to update this medicine.",
      }
    }

    // Update stock
    const result = await sql`
      UPDATE medicines
      SET stock = ${newStock}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING *
    `

    // Revalidate cache
    revalidatePath("/dashboard/medicines")

    return {
      success: true,
      message: "Stok obat berhasil diperbarui.",
      data: result[0] as Medicine,
    }
  } catch (error) {
    console.error("[v0] updateMedicineStock error:", error)
    return {
      success: false,
      message: "Terjadi kesalahan. Silakan coba lagi.",
    }
  }
}
