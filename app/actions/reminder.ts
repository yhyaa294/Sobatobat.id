"use server"

import { auth } from "@/auth"
import { getDb } from "@/lib/db"
import { createReminderSchema } from "@/lib/reminder-validation"
import type { Reminder, ReminderResponse, ActionResponse } from "@/types"
import { getNextReminderTime } from "@/lib/reminder"

export async function createReminder(
  medicineId: number,
  timeOfDay: string,
  daysOfWeek: string,
): Promise<ActionResponse<Reminder>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" }
    }

    const validation = createReminderSchema.safeParse({
      medicine_id: medicineId,
      time_of_day: timeOfDay,
      days_of_week: daysOfWeek,
    })

    if (!validation.success) {
      return { success: false, message: validation.error.errors[0].message }
    }

    const db = getDb()

    // Check if medicine belongs to user
    const medicine = await db(`SELECT id FROM medicines WHERE id = $1 AND user_id = $2`, [medicineId, session.user.id])

    if (medicine.length === 0) {
      return { success: false, message: "Obat tidak ditemukan" }
    }

    const result = await db(
      `INSERT INTO reminders (user_id, medicine_id, time_of_day, days_of_week, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [session.user.id, medicineId, timeOfDay, daysOfWeek],
    )

    return { success: true, message: "Pengingat berhasil dibuat", data: result[0] }
  } catch (error) {
    console.error("[v0] Error creating reminder:", error)
    return { success: false, message: "Gagal membuat pengingat" }
  }
}

export async function getReminders(): Promise<ActionResponse<ReminderResponse[]>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" }
    }

    const db = getDb()
    const reminders = await db(
      `SELECT r.*, m.name as medicine_name, m.dosage, m.expiry_date
       FROM reminders r
       JOIN medicines m ON r.medicine_id = m.id
       WHERE r.user_id = $1 AND r.is_active = true
       ORDER BY r.time_of_day ASC`,
      [session.user.id],
    )

    const formattedReminders: ReminderResponse[] = reminders.map((reminder: any) => {
      const nextTime = getNextReminderTime(reminder)
      return {
        id: reminder.id,
        medicine_id: reminder.medicine_id,
        time_of_day: reminder.time_of_day,
        days_of_week: reminder.days_of_week,
        is_active: reminder.is_active,
        notification_sent_today: reminder.notification_sent_today,
        last_notification_at: reminder.last_notification_at,
        created_at: reminder.created_at,
        updated_at: reminder.updated_at,
        medicine: {
          id: reminder.medicine_id,
          name: reminder.medicine_name,
          dosage: reminder.dosage,
          expiry_date: reminder.expiry_date,
          status: "safe",
          daysUntilExpiry: 0,
        },
        nextReminderTime: nextTime?.toISOString() || null,
        isOverdue: false,
      }
    })

    return { success: true, message: "Pengingat berhasil diambil", data: formattedReminders }
  } catch (error) {
    console.error("[v0] Error getting reminders:", error)
    return { success: false, message: "Gagal mengambil pengingat" }
  }
}

export async function deleteReminder(reminderId: number): Promise<ActionResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" }
    }

    const db = getDb()

    // Check ownership
    const reminder = await db(`SELECT user_id FROM reminders WHERE id = $1`, [reminderId])

    if (reminder.length === 0 || reminder[0].user_id !== session.user.id) {
      return { success: false, message: "Pengingat tidak ditemukan" }
    }

    await db(`DELETE FROM reminders WHERE id = $1`, [reminderId])

    return { success: true, message: "Pengingat berhasil dihapus" }
  } catch (error) {
    console.error("[v0] Error deleting reminder:", error)
    return { success: false, message: "Gagal menghapus pengingat" }
  }
}

export async function markReminderAsTaken(reminderId: number): Promise<ActionResponse> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" }
    }

    const db = getDb()

    const reminder = await db(`SELECT medicine_id FROM reminders WHERE id = $1 AND user_id = $2`, [
      reminderId,
      session.user.id,
    ])

    if (reminder.length === 0) {
      return { success: false, message: "Pengingat tidak ditemukan" }
    }

    const today = new Date().toISOString().split("T")[0]

    await db(
      `INSERT INTO reminder_history (reminder_id, user_id, medicine_id, notification_date, was_taken, taken_at)
       VALUES ($1, $2, $3, $4, true, NOW())
       ON CONFLICT DO NOTHING`,
      [reminderId, session.user.id, reminder[0].medicine_id, today],
    )

    return { success: true, message: "Obat berhasil ditandai diminum" }
  } catch (error) {
    console.error("[v0] Error marking reminder as taken:", error)
    return { success: false, message: "Gagal menyimpan data" }
  }
}
