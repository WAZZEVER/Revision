// Updated editor.tsx with dynamic note fetching

'use client';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import { useEffect, useState, useCallback } from 'react';
import Blockquote from '@tiptap/extension-blockquote';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

// Define an interface for the note parameters
interface NoteParams {
  noteid: string;
  subjectid: string;
  option: string;
}

interface TiptapProps {
  onEditorReady?: (editor: any) => void;
  showEditor?: boolean;
}

const BubbleContent = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };


  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1"
    >
      <Button
        variant="ghost"
        size="sm"
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-1 ${
          editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-1 ${
          editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-1 ${
          editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`h-8 w-8 p-1 ${
          editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        title="Add Link"
        onClick={setLink}
        className={`h-8 w-8 p-1 ${
          editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </BubbleMenu>
  );
};

const Tiptap = ({ onEditorReady, showEditor = false }: TiptapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  
  // Use Next.js hooks to get dynamic parameters
  const params = useParams();
  const searchParams = useSearchParams();

  // Extract note parameters
  const noteParams: NoteParams = {
    noteid: params.noteid as string,
    subjectid: params.subjectid as string,
    option: searchParams.get('option') || 'main'
  };

  // Updated saveContent with error handling improvements
const saveContent = useCallback(async (content: string) => {
    if (!userId || !content || !noteParams.noteid) return;
  
    try {
      // Ensure the note is fetched or created
      const { data: existingNote, error: fetchError } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)
        .eq('note_id', noteParams.noteid)
        .eq('subject_id', noteParams.subjectid)
        .eq('option', noteParams.option)
        .maybeSingle();
  
      if (fetchError) throw fetchError;
  
      // Handle existing note
      if (existingNote) {
        const { error: updateError } = await supabase
          .from('notes')
          .update({
            content,
            user_id: userId,
            last_edited_at: new Date().toISOString(),
          })
          .eq('id', existingNote.id);
  
        if (updateError) throw updateError;
  
      } else {
        // Create new note if not found
        const { error: insertError } = await supabase
          .from('notes')
          .insert([{
            user_id: userId,
            note_id: noteParams.noteid,
            subject_id: noteParams.subjectid,
            option: noteParams.option,
            content: content || '<p></p>',
            created_at: new Date().toISOString(),
            last_edited_at: new Date().toISOString(),
          }]);
  
        if (insertError) throw insertError;
      }
  
      console.log('Content saved successfully');
    } catch (err) {
      console.error('Error saving content:', err);
    }
  }, [userId, noteParams, supabase]);
  
  // Updated initialization and content fetching
  useEffect(() => {
    if (!userId || isInitialized) return;
  
    const initializeContent = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('content')
          .eq('user_id', userId)
          .eq('note_id', noteParams.noteid)
          .eq('subject_id', noteParams.subjectid)
          .eq('option', noteParams.option)
          .maybeSingle();
  
        if (error) throw error;
  
        if (data) {
          setHtmlContent(data.content || '<p></p>');
        } else {
          setHtmlContent('<p></p>'); // Default empty content
        }
      } catch (err) {
        console.error('Error initializing content:', err);
        setHtmlContent('<p></p>');
      } finally {
        setIsInitialized(true);
      }
    };
  
    initializeContent();
  }, [userId, isInitialized, supabase, noteParams]);
  


  useEffect(() => {
    setIsClient(true);
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push('/login');
      } else {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, [router]);

  // Initialize or fetch content
  useEffect(() => {
    if (!userId || isInitialized) return;

    const initializeContent = async () => {
      try {
        // Fetch existing note
        const { data, error } = await supabase
          .from('notes')
          .select('content')
          .eq('user_id', userId)
          .eq('note_id', noteParams.noteid)
          .eq('subject_id', noteParams.subjectid)
          .eq('option', noteParams.option)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Note exists, set its content
          setHtmlContent(data.content || '<p></p>');
        } else {
          // No existing note, set to empty paragraph
          setHtmlContent('<p></p>');
        }

        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing content:', err);
        setHtmlContent('<p></p>');
        setIsInitialized(true);
      }
    };

    initializeContent();
  }, [userId, isInitialized, supabase, noteParams]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: {
          HTMLAttributes: {
            class: 'horizontal-rule',
          },
        },
      }),
      Strike,
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Blockquote,
      ListItem.configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'custom-link',
        },
      }),
    ],
    content: htmlContent,
    editable: true,
    autofocus: true,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setHtmlContent(newContent);
      saveContent(newContent);
    },
  });
  
  // Effect to handle external content updates
  useEffect(() => {
    if (editor && htmlContent && !editor.isDestroyed) {
      const currentContent = editor.getHTML();
      if (currentContent !== htmlContent) {
        editor.commands.setContent(htmlContent);
        saveContent(htmlContent);
      }
    }
  }, [editor, htmlContent, saveContent]);

    // Throttle saveContent to prevent rapid multiple saves
    useEffect(() => {
        if (!editor) return;
      
        const timeout = setTimeout(() => {
          const newContent = editor.getHTML();
          if (newContent !== htmlContent) {
            setHtmlContent(newContent);
            saveContent(newContent); // Debounced save
          }
        }, 1000); // Delay to prevent immediate multiple saves
      
        return () => clearTimeout(timeout);
      }, [editor, htmlContent, saveContent]);
      

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!isClient || !editor) {
    return null;
  }

  return (
    <>
      {showEditor && (
        <div className="editor-container">
          <BubbleContent editor={editor} />
          <EditorContent 
  editor={editor} 
  style={{ outline: 'none', border: 'none' }} 
/>
        </div>
      )}
    </>
  );
};

export default Tiptap;
