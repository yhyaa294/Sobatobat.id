import { z } from "zod"

export const addMedicineSchema = z.object({
  name: z.string().min(1, "Nama obat harus diisi").max(255, "Nama obat maksimal 255 karakter"),
  dosage: z.string().max(100, "Dosis maksimal 100 karakter").optional().or(z.literal("")),
  frequency: z.string().max(100, "Frekuensi maksimal 100 karakter").optional().or(z.literal("")),
  expiry_date: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, "Tanggal kedaluwarsa tidak valid"),
  stock: z.number().int("Stok harus berupa angka bulat").min(1, "Stok minimal 1").optional().default(1),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional().or(z.literal("")),
})

export type AddMedicineInput = z.infer<typeof addMedicineSchema>
