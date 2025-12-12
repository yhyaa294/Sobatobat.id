"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Pill, ArrowRight, CheckCircle2, XCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type ResultType = "warning" | "safe" | "info" | null

interface InteractionResult {
  type: ResultType
  title: string
  description: string
}

const InteractionCheckerClient = () => {
  const [drugA, setDrugA] = useState("")
  const [drugB, setDrugB] = useState("")
  const [result, setResult] = useState<InteractionResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = () => {
    if (!drugA.trim() || !drugB.trim()) return

    setIsChecking(true)
    setResult(null)

    // Simulate API call
    setTimeout(() => {
      // Demo results based on input
      const drugALower = drugA.toLowerCase()
      const drugBLower = drugB.toLowerCase()

      if (
        (drugALower.includes("warfarin") && drugBLower.includes("aspirin")) ||
        (drugALower.includes("aspirin") && drugBLower.includes("warfarin"))
      ) {
        setResult({
          type: "warning",
          title: "⚠️ Perhatian: Interaksi Terdeteksi",
          description:
            "Warfarin dan Aspirin dapat meningkatkan risiko pendarahan. Jangan mengonsumsi bersamaan. Konsultasikan dengan dokter Anda.",
        })
      } else if (drugALower.includes("paracetamol") || drugBLower.includes("paracetamol")) {
        setResult({
          type: "safe",
          title: "✅ Aman Digunakan",
          description:
            "Tidak ada interaksi berbahaya yang terdeteksi antara kedua obat ini. Tetap ikuti dosis yang dianjurkan.",
        })
      } else {
        setResult({
          type: "info",
          title: "ℹ️ Informasi",
          description:
            "Kami tidak menemukan data interaksi spesifik. Untuk kepastian, silakan konsultasikan dengan apoteker atau dokter Anda.",
        })
      }
      setIsChecking(false)
    }, 1500)
  }

  const getAlertStyles = (type: ResultType) => {
    switch (type) {
      case "warning":
        return "border-destructive/50 bg-destructive/10 text-destructive"
      case "safe":
        return "border-primary/50 bg-primary/10 text-primary"
      case "info":
        return "border-muted-foreground/50 bg-muted text-muted-foreground"
      default:
        return ""
    }
  }

  const getAlertIcon = (type: ResultType) => {
    switch (type) {
      case "warning":
        return <XCircle className="h-5 w-5" />
      case "safe":
        return <CheckCircle2 className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Cek Interaksi Obat</h1>
          <p className="text-sm text-muted-foreground">Periksa keamanan kombinasi obat</p>
        </div>
      </div>

      {/* Input Card */}
      <Card className="shadow-md border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Masukkan Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Drug A */}
            <div className="flex-1 w-full">
              <Label htmlFor="drugA" className="text-sm font-medium mb-2 block">
                Obat Pertama
              </Label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="drugA"
                  value={drugA}
                  onChange={(e) => setDrugA(e.target.value)}
                  placeholder="cth: Paracetamol"
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Drug B */}
            <div className="flex-1 w-full">
              <Label htmlFor="drugB" className="text-sm font-medium mb-2 block">
                Obat / Makanan Kedua
              </Label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="drugB"
                  value={drugB}
                  onChange={(e) => setDrugB(e.target.value)}
                  placeholder="cth: Ibuprofen"
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Check Button */}
          <Button
            onClick={handleCheck}
            disabled={!drugA.trim() || !drugB.trim() || isChecking}
            className="w-full mt-6 h-12 rounded-xl text-base font-medium"
            size="lg"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Memeriksa...
              </span>
            ) : (
              "Periksa Keamanan"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Alert className={cn("border-2 rounded-xl", getAlertStyles(result.type))}>
          {getAlertIcon(result.type)}
          <AlertTitle className="text-base font-semibold">{result.title}</AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-relaxed">{result.description}</AlertDescription>
        </Alert>
      )}

      {/* Tips Card */}
      <Card className="shadow-md border-0 bg-secondary/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-3">💡 Tips Keamanan</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Selalu beri tahu dokter tentang semua obat yang Anda konsumsi</li>
            <li>• Hindari mengonsumsi obat dengan alkohol</li>
            <li>• Baca label obat dengan teliti sebelum mengonsumsi</li>
            <li>• Simpan obat sesuai petunjuk penyimpanan</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export { InteractionCheckerClient as InteractionChecker } from "./interaction-checker-client"
