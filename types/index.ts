export interface Medicine {
  id: number
  user_id: number
  name: string
  dosage: string | null
  frequency: string | null
  expiry_date: string
  stock: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MedicineResponse extends Omit<Medicine, "user_id"> {
  status: "safe" | "expiring" | "expired"
  daysUntilExpiry: number
}

export interface ActionResponse<T = null> {
  success: boolean
  message: string
  data?: T
}

export interface Reminder {
  id: number
  user_id: number
  medicine_id: number
  time_of_day: string // HH:MM format
  days_of_week: string // 7 digits (Mon-Sun): 1=active, 0=inactive
  is_active: boolean
  notification_sent_today: boolean
  last_notification_at: string | null
  created_at: string
  updated_at: string
}

export interface ReminderResponse extends Omit<Reminder, "user_id"> {
  medicine: MedicineResponse
  nextReminderTime: string | null
  isOverdue: boolean
}

export interface ReminderHistory {
  id: number
  reminder_id: number
  user_id: number
  medicine_id: number
  notification_date: string
  was_taken: boolean
  taken_at: string | null
  created_at: string
}
