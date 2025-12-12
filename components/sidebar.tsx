"use client"

import { Pill, Home, MessageCircle, AlertTriangle, Package, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userName?: string | null
  userImage?: string | null
}

const menuItems = [
  { id: "dashboard", label: "Beranda", icon: Home },
  { id: "chat", label: "Tanya Apoteker", icon: MessageCircle },
  { id: "interaction", label: "Cek Interaksi", icon: AlertTriangle },
  { id: "cabinet", label: "Kabinet Obat", icon: Package },
]

export function Sidebar({ activeTab, onTabChange, userName, userImage }: SidebarProps) {
  const handleLogout = async () => {
    await signOut({ redirect: true, redirectTo: "/" })
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-card to-card/95 border-r border-border shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">SobatObat</h1>
            <p className="text-xs text-muted-foreground">.ai</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 text-base",
                activeTab === item.id && "bg-primary/10 text-primary font-medium hover:bg-primary/15",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        {userName && (
          <div className="flex items-center gap-3 px-3 py-2">
            {userImage ? (
              <img src={userImage || "/placeholder.svg"} alt={userName} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">Akun Aktif</p>
            </div>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start gap-3 bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
