'use client'

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { ChatSection } from "@/components/ChatSection"
import { NoteSection } from "@/components/NoteSection"
import { FileUploadSection } from "@/components/FileUploadSection"
import { FocusMode } from "@/components/FocusMode"
import { Button } from "@/components/ui/button"
import { Maximize2 } from 'lucide-react'
import { useRouter, useSearchParams, useParams } from "next/navigation";

export default function Home() {
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

  if (isFocusMode) {
    return <FocusMode onExit={() => setIsFocusMode(false)} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isFullscreen={false} 
        onExitFullscreen={() => {}} 
        onOptionSelect={handleSelectOption}
        initialOption={selectedOption}
      />
      <main className="flex-grow grid grid-cols-3 gap-4 p-4">
        <ChatSection />
        <div className="relative">
          <NoteSection />
          <Button
            className="absolute top-2 right-2"
            size="icon"
            onClick={() => setIsFocusMode(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <FileUploadSection />
      </main>
    </div>
  )
}