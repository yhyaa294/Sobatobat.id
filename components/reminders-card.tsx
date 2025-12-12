"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, X } from "lucide-react"
import { getReminders, markReminderAsTaken, deleteReminder } from "@/app/actions/reminder"
import type { ReminderResponse } from "@/types"
import { formatDaysOfWeek } from "@/lib/reminder"

export function RemindersCard() {
  const [reminders, setReminders] = useState<ReminderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [markedTaken, setMarkedTaken] = useState<number[]>([])

  useEffect(() => {
    const fetchReminders = async () => {
      const result = await getReminders()
      if (result.success) {
        setReminders(result.data || [])
      }
      setLoading(false)
    }
    fetchReminders()
  }, [])

  const handleMarkTaken = async (reminderId: number) => {
    await markReminderAsTaken(reminderId)
    setMarkedTaken([...markedTaken, reminderId])
  }

  const handleDelete = async (reminderId: number) => {
    await deleteReminder(reminderId)
    setReminders(reminders.filter((r) => r.id !== reminderId))
  }

  if (loading) {
    return (
      <Card className="shadow-md border-0 bg-card">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Memuat pengingat...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md border-0 bg-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          Jadwal Obat
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada jadwal pengingat</p>
            <p className="text-xs mt-1">Tambahkan jadwal obat untuk menerima pengingat</p>
          </div>
        ) : (
          reminders.map((reminder) => {
            const isTaken = markedTaken.includes(reminder.id)
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl transition-all ${
                  isTaken ? "bg-green-50 dark:bg-green-950" : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={isTaken} onCheckedChange={() => handleMarkTaken(reminder.id)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">{reminder.medicine.name}</p>
                      {reminder.medicine.dosage && (
                        <Badge variant="outline" className="text-xs">
                          {reminder.medicine.dosage}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reminder.time_of_day} • {formatDaysOfWeek(reminder.days_of_week)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
