import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FileUploadSection() {
  const [files, setFiles] = useState<string[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files
    if (newFiles) {
      setFiles([...files, ...Array.from(newFiles).map(file => file.name)])
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Input type="file" onChange={handleFileUpload} multiple />
      </div>
      <ScrollArea className="flex-grow p-4">
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{file}</span>
              <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

