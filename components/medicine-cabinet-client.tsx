"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Plus, Search, Pill, Calendar, MoreVertical, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { deleteMedicine } from "@/app/actions/medicine"
import { toast } from "sonner"
import type { MedicineResponse } from "@/types"
import { AddMedicineDialog } from "./add-medicine-dialog"

interface MedicineCabinetClientProps {
  initialMedicines: MedicineResponse[]
}

export function MedicineCabinetClient({ initialMedicines }: MedicineCabinetClientProps) {
  const [medicines, setMedicines] = useState<MedicineResponse[]>(initialMedicines)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getExpiryBadge = (status: MedicineResponse["status"]) => {
    switch (status) {
      case "expired":
        return (
          <Badge variant="destructive" className="text-xs">
            Kedaluwarsa
          </Badge>
        )
      case "expiring":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs">Segera Habis</Badge>
      case "safe":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">Aman</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleDeleteMedicine = (id: number) => {
    startTransition(async () => {
      const response = await deleteMedicine(id)
      if (response.success) {
        setMedicines((prev) => prev.filter((m) => m.id !== id))
        toast.success("Obat berhasil dihapus")
      } else {
        toast.error(response.message)
      }
    })
  }

  const handleAddMedicine = (newMedicine: MedicineResponse) => {
    setMedicines((prev) =>
      [...prev, newMedicine].sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()),
    )
    setIsDialogOpen(false)
    toast.success("Obat berhasil ditambahkan")
  }

  const expiredCount = medicines.filter((m) => m.status === "expired").length
  const expiringCount = medicines.filter((m) => m.status === "expiring").length

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kabinet Obat Digital</h1>
            <p className="text-sm text-muted-foreground">Kelola persediaan obat Anda</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 rounded-xl" disabled={isPending}>
          <Plus className="w-4 h-4" />
          Tambah Obat Baru
        </Button>
      </div>

      {/* Add Medicine Dialog */}
      <AddMedicineDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onMedicineAdded={handleAddMedicine} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari obat..."
          className="pl-10 h-12 rounded-xl bg-card"
          disabled={isPending}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-sm border-0 bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{medicines.length}</p>
            <p className="text-xs text-muted-foreground">Total Obat</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-amber-500/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
            <p className="text-xs text-amber-600/80">Segera Habis</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-destructive/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
            <p className="text-xs text-destructive/80">Kedaluwarsa</p>
          </CardContent>
        </Card>
      </div>

      {/* Medicine List */}
      <Card className="shadow-md border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Obat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada obat ditemukan</p>
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-colors",
                  medicine.status === "expired"
                    ? "bg-destructive/5"
                    : medicine.status === "expiring"
                      ? "bg-amber-500/5"
                      : "bg-secondary/50 hover:bg-secondary",
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground">{medicine.name}</h3>
                    {getExpiryBadge(medicine.status)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    {medicine.dosage && <span>{medicine.dosage}</span>}
                    {medicine.dosage && <span>•</span>}
                    <span>{medicine.stock} tablet</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Exp: {formatDate(medicine.expiry_date)}</span>
                    {medicine.daysUntilExpiry > 0 && (
                      <>
                        <span>•</span>
                        <span>{medicine.daysUntilExpiry} hari lagi</span>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu disabled={isPending}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                      <span className="sr-only">Menu obat</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Tambah Stok</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMedicine(medicine.id)}>
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
