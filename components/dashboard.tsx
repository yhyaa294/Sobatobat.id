"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, MessageCircle, AlertTriangle, Sun, Moon, Pill } from "lucide-react"
import { RemindersCard } from "@/components/reminders-card"

interface DashboardProps {
  onNavigate: (tab: string) => void
  userName?: string
}

export function Dashboard({ onNavigate, userName = "User" }: DashboardProps) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Pagi" : currentHour < 18 ? "Siang" : "Malam"
  const GreetingIcon = currentHour >= 18 || currentHour < 6 ? Moon : Sun

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <GreetingIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Selamat {greeting}, {userName.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">Tetap sehat hari ini.</p>
        </div>
      </div>

      {/* Daily Reminder Card */}
      <RemindersCard />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="shadow-md border-0 bg-card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onNavigate("cabinet")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Scan Obat</h3>
              <p className="text-sm text-muted-foreground mt-1">Pindai kemasan obat</p>
            </CardContent>
          </Card>

          <Card
            className="shadow-md border-0 bg-card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onNavigate("chat")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Tanya Apoteker</h3>
              <p className="text-sm text-muted-foreground mt-1">Konsultasi dengan AI</p>
              <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20">Populer</Badge>
            </CardContent>
          </Card>

          <Card
            className="shadow-md border-0 bg-card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onNavigate("interaction")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <AlertTriangle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Cek Interaksi</h3>
              <p className="text-sm text-muted-foreground mt-1">Periksa keamanan obat</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health Tip Card */}
      <Card className="shadow-md border-0 bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Tips Kesehatan Hari Ini</h3>
              <p className="text-sm opacity-90 text-pretty">
                Pastikan untuk minum obat sesuai dosis yang dianjurkan. Jangan lupa minum air putih yang cukup untuk
                membantu penyerapan obat.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
