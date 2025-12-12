"use client"

import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, Bot, User, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PharmacistChatClient() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Halo! Saya adalah asisten apoteker virtual Anda. Ada yang bisa saya bantu mengenai obat-obatan atau kesehatan Anda hari ini? 💊",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-screen p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Tanya Apoteker AI</h1>
          <p className="text-sm text-muted-foreground">Konsultasi obat & kesehatan</p>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden shadow-md border-0 bg-card">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Terjadi kesalahan. Silakan coba lagi.</AlertDescription>
            </Alert>
          )}

          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
              <Avatar
                className={cn("w-8 h-8 flex-shrink-0", message.role === "assistant" ? "bg-primary" : "bg-secondary")}
              >
                <AvatarFallback
                  className={cn(
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "assistant"
                    ? "bg-secondary text-secondary-foreground rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none",
                )}
              >
                <p className="text-pretty leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ketik pertanyaan Anda..."
            disabled={isLoading}
            className="pr-12 h-12 rounded-xl bg-card border-border"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            type="button"
            disabled
          >
            <Mic className="w-5 h-5" />
            <span className="sr-only">Input suara</span>
          </Button>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Kirim pesan</span>
        </Button>
      </form>
    </div>
  )
}
