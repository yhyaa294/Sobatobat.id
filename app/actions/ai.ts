"use server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { getSession } from "@/lib/auth"

const InteractionSchema = z.object({
  status: z.enum(["safe", "warning", "danger"]).describe("Tingkat keamanan interaksi"),
  explanation: z.string().describe("Penjelasan singkat tentang interaksi obat dalam bahasa Indonesia"),
  recommendation: z.string().describe("Rekomendasi tindakan dalam bahasa Indonesia"),
  severity: z.enum(["none", "mild", "moderate", "severe"]).describe("Tingkat keparahan interaksi"),
})

type InteractionResult = z.infer<typeof InteractionSchema>

export async function checkInteraction(
  drugA: string,
  drugB: string,
): Promise<{ success: boolean; data?: InteractionResult; error?: string }> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    if (!drugA?.trim() || !drugB?.trim()) {
      return { success: false, error: "Nama obat harus diisi" }
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: InteractionSchema,
      prompt: `Analisis interaksi obat antara "${drugA}" dan "${drugB}" dengan SANGAT teliti.

INSTRUKSI PENTING:
1. Cek basis data farmakologi nyata tentang interaksi kedua obat
2. Status:
   - "safe" = TIDAK ada interaksi berbahaya (aman dikonsumsi bersama)
   - "warning" = Ada interaksi RINGAN/SEDANG (konsultasi dokter)
   - "danger" = Ada interaksi SERIUS (jangan dikonsumsi bersama)
3. SELALU dalam bahasa Indonesia
4. Berikan penjelasan SINGKAT tapi JELAS
5. Recommendation: apa yang HARUS dilakukan

Contoh interaksi berbahaya:
- Warfarin + Aspirin = Meningkatkan risiko perdarahan (DANGER)
- Ibuprofen + Ibuprofen = Overdosis (DANGER)
- Paracetamol + Ibuprofen = Aman jika dosis tepat (SAFE)
- Metformin + Alkohol = Risiko hipoglikemia (WARNING)

Berikan analisis untuk: "${drugA}" dan "${drugB}"`,
    })

    return { success: true, data: result as InteractionResult }
  } catch (error) {
    console.error("[v0] Interaction check error:", error)
    return { success: false, error: "Gagal menganalisis interaksi. Silakan coba lagi." }
  }
}
