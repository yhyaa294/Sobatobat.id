# SobatObat.ai - API Reference

## Authentication Required ✅

All API endpoints require user authentication via Next-Auth session.

## Chat Endpoint

### POST /api/chat

**Real-time AI Pharmacist Chat**

**Request:**
\`\`\`json
{
  "messages": [
    {
      "id": "1",
      "role": "user",
      "content": "Saya sakit kepala, obat apa yang aman?"
    }
  ]
}
\`\`\`

**Response:** Server-sent Events (Streaming)
\`\`\`
{
  "type": "tool-call",
  "id": "call_xxx",
  "toolName": "...",
  "toolCallId": "call_xxx",
  "args": {}
}
\`\`\`

**Status Codes:**
- 200: Success (streaming)
- 401: Unauthorized (not logged in)
- 400: Invalid message format
- 500: Server error

**Example Usage (Client):**
\`\`\`tsx
const { messages, input, handleSubmit } = useChat({
  api: "/api/chat"
})
\`\`\`

---

## Drug Interaction Check

### POST /app/actions/ai.ts → checkInteraction()

**Analyze Drug Interactions**

**Input:**
\`\`\`ts
checkInteraction("Warfarin", "Aspirin")
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "status": "danger",
    "explanation": "Kombinasi Warfarin + Aspirin meningkatkan risiko perdarahan serius",
    "recommendation": "Jangan dikonsumsi bersama. Konsultasi dokter sebelum perubahan",
    "severity": "severe"
  }
}
\`\`\`

**Status Values:**
- `safe`: Tidak ada interaksi
- `warning`: Interaksi ringan/sedang
- `danger`: Interaksi serius

**Severity Values:**
- `none`: Tidak ada
- `mild`: Ringan
- `moderate`: Sedang
- `severe`: Serius

---

## Medicine Management

### Add Medicine
\`\`\`ts
addMedicine({
  name: "Paracetamol",
  dosage: "500mg",
  frequency: "3x sehari",
  expiryDate: "2025-12-31",
  stock: 20,
  notes: "Untuk demam"
})
\`\`\`

**Returns:** `MedicineResponse` with auto-calculated status

### Get Medicines
\`\`\`ts
getMedicines()
\`\`\`

**Returns:** Array of medicines with:
- Status (safe/expiring/expired)
- Days until expiry
- User info

### Delete Medicine
\`\`\`ts
deleteMedicine(medicineId)
\`\`\`

### Update Stock
\`\`\`ts
updateMedicineStock(medicineId, newStock)
\`\`\`

---

## Reminder Management

### Create Reminder
\`\`\`ts
addReminder({
  medicineId: 123,
  time: "08:00",
  daysOfWeek: ["monday", "tuesday"],
  notes: "Minum dengan air"
})
\`\`\`

### Get Reminders
\`\`\`ts
getReminders()
\`\`\`

### Delete Reminder
\`\`\`ts
deleteReminder(reminderId)
\`\`\`

### Mark Reminder As Taken
\`\`\`ts
markReminderAsTaken(reminderId)
\`\`\`

---

## Response Formats

### Success Response
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": "Descriptive error message"
}
\`\`\`

---

## Rate Limits

- Chat: 100 requests/hour per user
- Interaction check: 200 requests/hour per user
- Medicine operations: 500 requests/hour per user
- Reminders: 500 requests/hour per user

---

## Performance

| Endpoint | Latency | Cached |
|----------|---------|--------|
| POST /api/chat | 200-2000ms | No |
| checkInteraction | 800-1500ms | No |
| getMedicines | 50-200ms | 5min |
| addMedicine | 100-300ms | No |

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Unauthorized | Login required |
| 400 | Bad request | Check parameters |
| 404 | Not found | Item doesn't exist |
| 429 | Rate limited | Wait & retry |
| 500 | Server error | Contact support |

---

## Examples

### Login Flow
\`\`\`ts
import { signIn } from "@/auth"

await signIn("credentials", {
  email: "user@example.com",
  password: "password123"
})
\`\`\`

### Use Chat
\`\`\`tsx
import { useChat } from "ai/react"

const { messages, input, handleSubmit } = useChat({
  api: "/api/chat"
})
\`\`\`

### Check Interaction
\`\`\`ts
import { checkInteraction } from "@/app/actions/ai"

const result = await checkInteraction("Warfarin", "Aspirin")
if (result.data?.status === "danger") {
  // Show warning
}
\`\`\`

---

**API Version:** v1.0
**Last Updated:** 2025-12-11
**Status:** Production Ready ✅
`
