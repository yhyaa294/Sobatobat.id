"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Clock, Trash2 } from "lucide-react"
import { getReminders, createReminder, deleteReminder } from "@/app/actions/reminder"
import { getMedicines } from "@/app/actions/medicine"
import type { ReminderResponse, MedicineResponse } from "@/types"
import { formatDaysOfWeek } from "@/lib/reminder"
import { toast } from "sonner"

const DAYS = [
  { index: 0, name: "Senin" },
  { index: 1, name: "Selasa" },
  { index: 2, name: "Rabu" },
  { index: 3, name: "Kamis" },
  { index: 4, name: "Jumat" },
  { index: 5, name: "Sabtu" },
  { index: 6, name: "Minggu" },
]

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderResponse[]>([])
  const [medicines, setMedicines] = useState<MedicineResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    medicineId: "",
    time: "",
    days: [true, true, true, true, true, true, true],
  })

  useEffect(() => {
    const fetchData = async () => {
      const [remindersRes, medicinesRes] = await Promise.all([getReminders(), getMedicines()])
      if (remindersRes.success) setReminders(remindersRes.data || [])
      if (medicinesRes.success) setMedicines(medicinesRes.data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.medicineId || !formData.time) {
      toast.error("Lengkapi semua data")
      return
    }

    const daysString = formData.days.map((d) => (d ? "1" : "0")).join("")
    const result = await createReminder(Number(formData.medicineId), formData.time, daysString)

    if (result.success) {
      toast.success("Pengingat berhasil dibuat")
      setOpen(false)
      setFormData({ medicineId: "", time: "", days: [true, true, true, true, true, true, true] })
      const res = await getReminders()
      if (res.success) setReminders(res.data || [])
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await deleteReminder(id)
    if (result.success) {
      toast.success("Pengingat berhasil dihapus")
      setReminders(reminders.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Jadwal Pengingat Obat</h1>
          <p className="text-muted-foreground mt-1">Kelola jadwal minum obat Anda</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengingat Obat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Pilih Obat</Label>
                <select
                  value={formData.medicineId}
                  onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">-- Pilih Obat --</option>
                  {medicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} {med.dosage && `(${med.dosage})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Waktu</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-3 block">Hari</Label>
                <div className="grid grid-cols-2 gap-3">
                  {DAYS.map(({ index, name }) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.days[index]}
                        onCheckedChange={(checked) => {
                          const newDays = [...formData.days]
                          newDays[index] = checked as boolean
                          setFormData({ ...formData, days: newDays })
                        }}
                      />
                      <label className="text-sm cursor-pointer">{name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Buat Pengingat
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
      ) : reminders.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Belum ada pengingat</h3>
            <p className="text-muted-foreground mb-4">Tambahkan jadwal obat untuk menerima pengingat harian</p>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Buat Pengingat Pertama
              </Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{reminder.medicine.name}</h3>
                      {reminder.medicine.dosage && (
                        <Badge variant="outline" className="text-xs">
                          {reminder.medicine.dosage}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {reminder.time_of_day} • {formatDaysOfWeek(reminder.days_of_week)}
                    </p>
                    {reminder.nextReminderTime && (
                      <p className="text-xs text-primary">
                        Pengingat berikutnya: {new Date(reminder.nextReminderTime).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(reminder.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
