import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import MainContent from './MainContent'

export function NoteSection() {
    const [editor, setEditor] = useState<any>(null);
    const [splitScreen, setSplitScreen] = useState(false);

    const toggleSplitScreen = () => setSplitScreen(prev => !prev);
  
  return (
    <div className="h-full p-4">
      <MainContent
            splitScreen={splitScreen}
            toggleSplitScreen={toggleSplitScreen}
            editor={editor}
            setEditor={setEditor}
            minHeight="300px"  // Set a minimum height
  maxHeight="300px"  // Set a maximum height
          />
    </div>
  )
}


