"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircleIcon, ArrowLeftIcon, MoonIcon, SunIcon } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import Chatbox from "@/components/chatbox"
import RecentCards from "@/components/recent-cards"
import Schedule from "@/components/schedule"
import { createClient } from "@/utils/supabase/client";  // Import Supabase client
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from '@/components/mode-toggle'
import Link from 'next/link'


type DashboardContentProps = {
  title: string;
  description: string;
  eventDate: string; // Expecting an event date in string format (ISO 8601)
}

export default function DashboardContent({ title, description, eventDate }: DashboardContentProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [daysLeft, setDaysLeft] = useState(0)
  const [eventStatus, setEventStatus] = useState("")

  // Calculate days left and event status
  useEffect(() => {
    const eventDateObj = new Date(eventDate)
    const currentDate = new Date()
    const timeDifference = eventDateObj.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24))

    setDaysLeft(daysRemaining)

    if (daysRemaining < 0) {
      setEventStatus("Event ended")
    } else if (daysRemaining === 0) {
      setEventStatus("Good Luck!")
    } else {
      setEventStatus(`${daysRemaining} days until next event`)
    }
  }, [eventDate])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex flex-col h-screen bg-background text-foreground">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-4 bg-card">
          <div className='ml-6'>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline" size="icon" onClick={() => setIsChatOpen(!isChatOpen)}>
              <MessageCircleIcon className="h-4 w-4" />
            </Button>
            <Link href="/dashboard">
      <Button variant="outline">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Return
      </Button>
    </Link>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center">
            {/* Calendar */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-center items-center">
  <CardContent className="text-center">
    <p className="text-xl mt-4 font-semibold">{new Date(eventDate).toLocaleDateString()}</p>
    <Calendar
      mode="single"
      selected={new Date(eventDate)}
      className="rounded-md border mx-auto my-4"
    />
    <p className="mt-4 text-2xl font-bold">{daysLeft}</p>
    <p className="text-sm text-muted-foreground">{eventStatus}</p>
  </CardContent>
</Card>


            {/* Recent Cards */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Cards</CardTitle>
                <CardDescription>Your latest activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCards />
              </CardContent>
            </Card>

              {/* Progress and Insights */}
              <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={33} className="w-full" />
                <p className="mt-2 text-sm text-muted-foreground">33% of your goals completed</p>
              </CardContent>
            </Card>

            {/* Insights/Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Based on your recent activity, we recommend focusing on project management skills.</p>
              </CardContent>
            </Card>
            {/* Schedule */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Your upcoming tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Schedule />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chatbox */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 w-80 h-96 bg-card rounded-lg shadow-lg overflow-hidden"
            >
              <Chatbox onClose={() => setIsChatOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
