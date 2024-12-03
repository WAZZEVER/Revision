'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { MessageCircle, X } from 'lucide-react'
import { Navbar } from "./Navbar"
import { useRouter, useSearchParams, useParams } from "next/navigation";
import MainContent from './MainContent'

export function FocusMode({ onExit }: { onExit: () => void }) {
  const [isResizing, setIsResizing] = useState(false)
  const [leftWidth, setLeftWidth] = useState(50)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [chatInput, setChatInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  

  const [isFocusMode, setIsFocusMode] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Extract noteid and subjectid from URL params
  const noteid = params.noteid as string;
  const pageid = params.subjectid as string;

  // Get the current option from search params, default to 'main'
  const [selectedOption, setSelectedOption] = useState(() => {
    const optionFromParams = searchParams.get("option");
    return optionFromParams || "main";
  });

  // Effect to update the URL if no option is specified
  useEffect(() => {
    if (!searchParams.get("option")) {
      const newUrl = `/${noteid}/${pageid}?option=main`;
      router.replace(newUrl);
    }
  }, [noteid, pageid, router, searchParams]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    const newUrl = `/${noteid}/${pageid}?option=${option}`;
    router.push(newUrl);
  };

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      setLeftWidth(Math.min(Math.max(newLeftWidth, 20), 80))
    }
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput, isUser: true }])
      setChatInput("")
    }
  }


    const [editor, setEditor] = useState<any>(null);
    const [splitScreen, setSplitScreen] = useState(false);

    const toggleSplitScreen = () => setSplitScreen(prev => !prev);


  return (
    <div 
      className="flex flex-col h-screen relative"
      onMouseMove={(e) => {
        if (navbarRef.current) {
          const rect = navbarRef.current.getBoundingClientRect()
          setIsNavbarVisible(e.clientY <= rect.bottom + 20)
        }
      }}
    >
      <div 
        ref={navbarRef}
        className={`absolute top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        onMouseEnter={() => setIsNavbarVisible(true)}
        onMouseLeave={() => setIsNavbarVisible(false)}
      >
       <Navbar 
        isFullscreen={false} 
        onExitFullscreen={() => {}} 
        onOptionSelect={handleSelectOption}
        initialOption={selectedOption}
      />

      </div>
      <div ref={containerRef} className="flex h-full">
        <div style={{ width: `${leftWidth}%` }} className="h-full overflow-hidden">
          <ScrollArea className="h-full p-4">
            <p>This is the content of the selected file</p>
          </ScrollArea>
        </div>
        <div
          className="w-1 bg-border cursor-col-resize"
          onMouseDown={handleMouseDown}
        />
        <div style={{ width: `${100 - leftWidth}%` }} className="h-full relative">
          <MainContent
            splitScreen={splitScreen}
            toggleSplitScreen={toggleSplitScreen}
            editor={editor}
            setEditor={setEditor}
            minHeight="540px"  // Set a minimum height
            maxHeight="540px"  // Set a maximum height
          />
          

          <Button
            className="absolute bottom-4 right-4"
            size="icon"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
        {isChatOpen && (
          <div className="absolute bottom-16 right-4 w-80 h-96 bg-background border rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-2 border-b">
              <span className="font-semibold">Chat</span>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow p-2">
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.isUser ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    {message.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <div className="p-2 border-t">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <Button onClick={sendChatMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

