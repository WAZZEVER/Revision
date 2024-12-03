'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, LayoutDashboard, Settings, Users, LogOut } from 'lucide-react'
import { signOutAction } from "@/app/actions";

type SidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={open ? 'open' : 'closed'}
        initial={{ width: open ? 250 : 0 }}
        animate={{ width: open ? 250 : 70 }}
        exit={{ width: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-background border-r flex flex-col"
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={cn("font-semibold text-lg", !open && "hidden")}>Dashboard</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="h-8 w-8"
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-2 p-2">
            <Link href="/" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {open && "Dashboard"}
              </Button>
            </Link>
            <Link href="/users" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                {open && "Users"}
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                {open && "Settings"}
              </Button>
            </Link>
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                {open && "Sign Out"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign you out of your account. Make sure you have saved all your work before proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="secondary" onClick={() => setIsAlertOpen(false)}>
                  Cancel
                </Button>
                <form action={signOutAction}>
                  <Button type="submit">Sign Out</Button>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
