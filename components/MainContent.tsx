// MainCotent.tsx
'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bold,
  Italic,
  List,
  Highlighter,
  SplitSquareVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline,
  Undo,
  Redo,
  Indent,
  Outdent,
  Maximize2,
  Minimize2,
  Code,
  Link as LinkIcon,
  Minus,
  ListOrdered,
  Heading1,
  Heading2,
  Strikethrough,
} from 'lucide-react'
import Tiptap from '@/components/TipTap'
import { useState } from 'react'

interface MainContentProps {
    splitScreen: boolean;
    toggleSplitScreen: () => void;
    editor: any;
    setEditor: (editor: any) => void;
    minHeight?: string;  // Optional prop for minHeight
    maxHeight?: string;  // Optional prop for maxHeight
  }
  

  export default function MainContent({ 
    splitScreen, 
    toggleSplitScreen, 
    editor, 
    setEditor,
    minHeight = 'auto', // Default to 'auto' if not passed
    maxHeight = 'none', // Default to 'none' if not passed
  }: MainContentProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCode, setShowCode] = useState(false);


  const setLink = () => {
    if (!editor) return;
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`flex-1 bg-white dark:bg-gray-800 ${splitScreen ? 'flex' : ''}`}>
      <div className={`${splitScreen ? 'w-1/2' : 'w-full'} h-full flex flex-col`}>
        <div className="bg-gray-100 dark:bg-gray-700 p-2">
          <div className="flex flex-wrap gap-2">
            {/* Headings Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Heading 1"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Heading 2"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Formatting Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Bold"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Italic"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Underline"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={editor?.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Strikethrough"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={editor?.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </div>

            {/* Alignment Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Align Left"
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Align Center"
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Align Right"
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Justify"
                onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                className={editor?.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* List Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Bullet List"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Numbered List"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Indentation Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Outdent"
                onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
              >
                <Outdent className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Indent"
                onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
              >
                <Indent className="h-4 w-4" />
              </Button>
            </div>

            {/* History Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Undo"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Redo"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Insert Group */}
            <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
              <Button
                variant="ghost"
                size="icon"
                title="Insert Link"
                onClick={setLink}
                className={editor?.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Insert Horizontal Rule"
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {/* View Options Group */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="View Code"
                onClick={() => setShowCode(!showCode)}
                className={showCode ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Toggle Full Screen"
                onClick={toggleFullScreen}
                className={isFullScreen ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSplitScreen}
                title="Toggle Split Screen"
                className={splitScreen ? 'bg-gray-200 dark:bg-gray-600' : ''}
              >
                <SplitSquareVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
        <div
            className="max-w-5xl mx-auto overflow-auto"
            style={{ minHeight, maxHeight }}
          >
                {showCode ? (
      <div className="bg-gray-900 text-gray-100 p-4 font-mono">
        {editor?.getHTML()}
      </div>
    ) : (
      <div className={isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800 p-4' : ''}>
        <Tiptap onEditorReady={setEditor} showEditor={true} />
      </div>
    )}
  </div>
</ScrollArea>


        
      </div>

      {splitScreen && (
        <div className="w-1/2 h-full border-l dark:border-gray-700 p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Media preview will appear here in split-screen mode
          </div>
        </div>
      )}

      <style jsx global>{`
        .editor-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
          background: white;
          overflow-y: auto;
        }

        @media (prefers-color-scheme: dark) {
          .editor-fullscreen {
            background: rgb(31, 41, 55);
          }
        }
      `}</style>
    </div>
  )
}