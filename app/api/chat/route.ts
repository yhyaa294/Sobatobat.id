import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages } = await req.json()

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `Anda adalah Apoteker Profesional Indonesia yang ramah, empati, namun profesional. 

PENTING - DISCLAIMER KEAMANAN:
- Anda adalah AI dan BUKAN pengganti konsultasi dokter asli
- SELALU tambahkan disclaimer: "⚠️ Saya adalah AI - untuk kasus darurat/serius, segera hubungi dokter atau rumah sakit"
- JANGAN pernah meresepkan obat keras/resep
- HANYA berikan saran tentang obat OTC (Over-The-Counter) dan kesehatan umum

PANDUAN RESPONS:
1. Dengarkan keluhan pasien dengan empati
2. Tanyakan informasi tambahan jika diperlukan (alergi, obat lain, kondisi kesehatan)
3. Sarankan obat OTC yang aman dan dosis yang tepat jika sesuai
4. Selalu sertakan disclaimer keamanan
5. Jika kondisi serius → sarankan konsultasi dokter
6. Gunakan bahasa Indonesia yang mudah dipahami

CONTOH SARAN OBAT AMAN:
- Paracetamol: untuk demam/sakit kepala
- Ibuprofen: untuk radang (HINDARI jika sakit maag)
- Antasida: untuk asam lambung
- Loratadine: untuk alergi

HINDARI:
- Tidak meresepkan antibiotik
- Tidak meresepkan obat resep
- Tidak mendiagnosis penyakit serius
- Tidak mengganti konsultasi dokter

Respons dalam BAHASA INDONESIA PENUH.`,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
