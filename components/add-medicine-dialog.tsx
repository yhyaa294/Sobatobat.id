"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addMedicine } from "@/app/actions/medicine"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { MedicineResponse } from "@/types"

interface AddMedicineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMedicineAdded: (medicine: MedicineResponse) => void
}

export function AddMedicineDialog({ open, onOpenChange, onMedicineAdded }: AddMedicineDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    expiry_date: "",
    stock: "1",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const submitData = {
        ...formData,
        stock: Number.parseInt(formData.stock) || 1,
      }

      const response = await addMedicine(submitData)

      if (response.success && response.data) {
        const medicineResponse: MedicineResponse = {
          id: response.data.id,
          name: response.data.name,
          dosage: response.data.dosage,
          frequency: response.data.frequency,
          expiry_date: response.data.expiry_date,
          stock: response.data.stock,
          notes: response.data.notes,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          status: "safe",
          daysUntilExpiry: 0,
        }

        onMedicineAdded(medicineResponse)
        setFormData({
          name: "",
          dosage: "",
          frequency: "",
          expiry_date: "",
          stock: "1",
          notes: "",
        })
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Obat Baru</DialogTitle>
          <DialogDescription>Masukkan detail obat yang ingin ditambahkan ke kabinet Anda</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Medicine Name (Required) */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Obat *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Paracetamol"
              required
              disabled={isPending}
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosis</Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="Contoh: 500mg"
              disabled={isPending}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frekuensi Minum</Label>
            <Input
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="Contoh: 3x sehari"
              disabled={isPending}
            />
          </div>

          {/* Expiry Date (Required) */}
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Tanggal Kedaluwarsa *</Label>
            <Input
              id="expiry_date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              disabled={isPending}
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">Jumlah Tablet</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="1"
              value={formData.stock}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh: Simpan di tempat sejuk dan kering"
              disabled={isPending}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Menyimpan..." : "Tambah Obat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
