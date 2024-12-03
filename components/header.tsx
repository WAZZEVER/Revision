'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PlusIcon, MenuIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { ModeToggle } from './mode-toggle'
import { createClient } from '@/utils/supabase/client'
import CreateItemModal from './createmodal'

type HeaderProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [userName, setUserName] = useState('John Doe')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.getUser()

      if (data?.user) {
        // Access user metadata with proper type casting
        const user = data.user as any;  // Type cast here to safely access user_metadata
        setUserName(user.user_metadata?.full_name || 'John Doe')

        // Get the avatar URL from user metadata
        const avatar = user.user_metadata?.avatar_url
        if (avatar) {
          setAvatarUrl(avatar)
        }
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="bg-background border-b p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          Hello, {userName}
        </motion.h1>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <CreateItemModal />
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} />
          ) : (
            <AvatarFallback>{userName[0]}</AvatarFallback> // Use first letter of userName if no avatar
          )}
        </Avatar>
      </div>
    </header>
  )
}
