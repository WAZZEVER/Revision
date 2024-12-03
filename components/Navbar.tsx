import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, ChevronDown, Plus, FileText, Minimize2 } from 'lucide-react'

interface NavbarProps {
  isFullscreen: boolean
  onExitFullscreen: () => void
  onOptionSelect: (option: string) => void
  initialOption?: string
}

export function Navbar({ 
  isFullscreen, 
  onExitFullscreen, 
  onOptionSelect, 
  initialOption = "main" 
}: NavbarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedFile, setSelectedFile] = useState("File 1")
  const [selectedOption, setSelectedOption] = useState(initialOption)

  const files = ["File 1", "File 2", "File 3"] // This would be dynamic in a real app

  useEffect(() => {
    // Update selected option if initialOption changes
    setSelectedOption(initialOption);
  }, [initialOption]);

  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option); // Update the UI
    onOptionSelect(option);    // Trigger navigation in the parent component
  };

  return (
    <nav 
      className={`flex items-center justify-between p-4 bg-background border-b transition-opacity duration-300 ${isFullscreen && !isHovered ? 'opacity-0' : 'opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Options <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>New File</DropdownMenuItem>
            <DropdownMenuItem>Open Folder</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
        {isFullscreen && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  {selectedFile}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {files.map((file) => (
                  <DropdownMenuItem key={file} onSelect={() => setSelectedFile(file)}>
                    {file}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={onExitFullscreen}>
              <Minimize2 className="mr-2 h-4 w-4" />
              Exit Fullscreen
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedOption} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleDropdownSelect('main')}>Main</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDropdownSelect('1')}>Option 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDropdownSelect('2')}>Option 2</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleDropdownSelect('3')}>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-lg font-semibold">Current Topic</div>
    </nav>
  )
}