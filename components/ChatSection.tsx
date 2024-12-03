import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatSection() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }])
      // Here you would typically send the message to your chatbot API
      // and then add the response to the messages
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {message.text}
            </span>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
}

