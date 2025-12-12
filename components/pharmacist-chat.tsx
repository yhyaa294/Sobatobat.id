"use client"
import { PharmacistChatClient } from "./pharmacist-chat-client"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Halo! Saya adalah asisten apoteker virtual Anda. Ada yang bisa saya bantu mengenai obat-obatan atau kesehatan Anda hari ini?",
  },
  {
    id: 2,
    role: "user",
    content: "Saya sakit kepala tapi punya riwayat asam lambung. Obat apa yang aman?",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Saya sarankan untuk menghindari Ibuprofen karena dapat meningkatkan asam lambung. Paracetamol lebih aman untuk perut Anda. Dosis yang direkomendasikan adalah 500mg, maksimal 4x sehari. Apakah Anda ingin informasi lebih lanjut tentang dosis yang tepat?",
  },
]

export function PharmacistChat() {
  return <PharmacistChatClient />
}
