'use client'

import { useState, useEffect } from 'react'
import Sidebar from './sidebar'
import Header from './header'
import RecentTopics from './recent-topics'
import { SkeletonDashboard } from './skeleton-dashboard'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SkeletonDashboard />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <RecentTopics />
        </main>
      </div>
    </div>
  )
}

