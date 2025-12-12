import { z } from "zod"

export const createReminderSchema = z.object({
  medicine_id: z.number().int().positive("Pilih obat terlebih dahulu"),
  time_of_day: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu harus HH:MM"),
  days_of_week: z
    .string()
    .regex(/^[01]{7}$/, "Harus memilih minimal satu hari")
    .refine((val) => val.includes("1"), "Pilih minimal satu hari"),
})

export const updateReminderSchema = createReminderSchema.partial()

export type CreateReminderInput = z.infer<typeof createReminderSchema>
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>
