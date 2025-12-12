"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Dashboard } from "@/components/dashboard"
import { PharmacistChat } from "@/components/pharmacist-chat"
import { InteractionChecker } from "@/components/interaction-checker"
import { MedicineCabinet } from "@/components/medicine-cabinet"
import { useIsMobile } from "@/hooks/use-mobile"

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface DashboardClientProps {
  user?: User
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useIsMobile()

  const displayName = user?.name || user?.email?.split("@")[0] || "Pengguna"

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} userName={displayName} />
      case "chat":
        return <PharmacistChat />
      case "interaction":
        return <InteractionChecker />
      case "cabinet":
        return <MedicineCabinet />
      default:
        return <Dashboard onNavigate={setActiveTab} userName={displayName} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 pb-20 overflow-auto">{renderContent()}</main>
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userName={displayName} userImage={user?.image} />
          <main className="flex-1 ml-64 overflow-auto">{renderContent()}</main>
        </div>
      )}
    </div>
  )
}
