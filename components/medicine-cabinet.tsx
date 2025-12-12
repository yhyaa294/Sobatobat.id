"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Plus, Search, Pill, Calendar, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Medicine {
  id: number
  name: string
  dosage: string
  quantity: number
  expiryDate: string
  expiryStatus: "expired" | "expiring" | "safe"
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol",
    dosage: "500mg",
    quantity: 20,
    expiryDate: "2025-01-15",
    expiryStatus: "expiring",
  },
  {
    id: 2,
    name: "Vitamin C",
    dosage: "1000mg",
    quantity: 30,
    expiryDate: "2025-12-20",
    expiryStatus: "safe",
  },
  {
    id: 3,
    name: "Amoxicillin",
    dosage: "250mg",
    quantity: 10,
    expiryDate: "2024-11-01",
    expiryStatus: "expired",
  },
  {
    id: 4,
    name: "Omeprazole",
    dosage: "20mg",
    quantity: 14,
    expiryDate: "2026-03-15",
    expiryStatus: "safe",
  },
  {
    id: 5,
    name: "Cetirizine",
    dosage: "10mg",
    quantity: 8,
    expiryDate: "2025-06-30",
    expiryStatus: "safe",
  },
]

export function MedicineCabinet() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getExpiryBadge = (status: Medicine["expiryStatus"]) => {
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
        <Button className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" />
          Tambah Obat Baru
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari obat..."
          className="pl-10 h-12 rounded-xl bg-card"
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
            <p className="text-2xl font-bold text-amber-600">
              {medicines.filter((m) => m.expiryStatus === "expiring").length}
            </p>
            <p className="text-xs text-amber-600/80">Segera Habis</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-destructive/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {medicines.filter((m) => m.expiryStatus === "expired").length}
            </p>
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
                  medicine.expiryStatus === "expired"
                    ? "bg-destructive/5"
                    : medicine.expiryStatus === "expiring"
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
                    {getExpiryBadge(medicine.expiryStatus)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{medicine.dosage}</span>
                    <span>•</span>
                    <span>{medicine.quantity} tablet</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Exp: {formatDate(medicine.expiryDate)}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreVertical className="w-5 h-5" />
                      <span className="sr-only">Menu obat</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Tambah Stok</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
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
