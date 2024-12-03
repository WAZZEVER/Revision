"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { XIcon, SendIcon } from 'lucide-react'

interface ChatboxProps {
  onClose: () => void
}

export default function Chatbox({ onClose }: ChatboxProps) {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }])
      setInput("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Thanks for your message!", sender: "bot" }])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-muted">
        <h3 className="font-semibold">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-2 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 bg-card">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button size="icon" onClick={sendMessage}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

