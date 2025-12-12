"use client"

import { Home, MessageCircle, AlertTriangle, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Beranda", icon: Home },
  { id: "chat", label: "Tanya AI", icon: MessageCircle },
  { id: "interaction", label: "Interaksi", icon: AlertTriangle },
  { id: "cabinet", label: "Kabinet", icon: Package },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-20 px-2 gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl transition-all flex-1",
                isActive
                  ? "text-primary bg-primary/5 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
              <span className={cn("text-xs leading-tight", isActive && "font-semibold")}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
