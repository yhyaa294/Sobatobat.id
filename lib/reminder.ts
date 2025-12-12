import type { Reminder } from "@/types"

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

export function getDayName(dayIndex: number): string {
  return DAYS[dayIndex] || ""
}

export function getDayShortName(dayIndex: number): string {
  return DAYS_SHORT[dayIndex] || ""
}

export function parseDaysOfWeek(daysString: string): string[] {
  return daysString
    .split("")
    .map((bit, index) => (bit === "1" ? getDayShortName(index) : null))
    .filter((day): day is string => day !== null)
}

export function formatDaysOfWeek(daysString: string): string {
  const days = parseDaysOfWeek(daysString)
  if (days.length === 7) return "Setiap hari"
  if (days.length === 0) return "Tidak ada"
  if (days.length === 5 && !daysString.includes("1", 5)) return "Hari kerja"
  return days.join(", ")
}

export function isTimeOverdue(timeStr: string): boolean {
  const [hours, minutes] = timeStr.split(":").map(Number)
  const now = new Date()
  const reminderTime = new Date()
  reminderTime.setHours(hours, minutes, 0, 0)
  return now > reminderTime
}

export function getNextReminderTime(reminder: Reminder): Date | null {
  const now = new Date()
  const [hours, minutes] = reminder.time_of_day.split(":").map(Number)

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    checkDate.setHours(hours, minutes, 0, 0)

    const dayOfWeek = (checkDate.getDay() + 6) % 7 // Convert to Mon=0
    if (reminder.days_of_week[dayOfWeek] === "1" && checkDate > now) {
      return checkDate
    }
  }
  return null
}

export function createDaysOfWeekString(selectedDays: boolean[]): string {
  return selectedDays.map((day) => (day ? "1" : "0")).join("")
}
