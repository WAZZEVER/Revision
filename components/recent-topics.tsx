import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { IoTrashOutline } from 'react-icons/io5' // Import an icon for the remove button
import { Button } from "@/components/ui/button"
import Link from 'next/link'

type Topic = {
  id: string
  title: string
  description?: string | null
  date: string
  subjects: string[]
  created_at: string
}

let refreshTopics: () => void = () => {}

export default function RecentTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentTopics = useCallback(async () => {
    try {
      setIsLoading(true)
      const supabase = await createClient()

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error

      setTopics(data || [])
    } catch (err) {
      console.error('Error fetching recent topics:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecentTopics()
    refreshTopics = fetchRecentTopics
  }, [fetchRecentTopics])

  const handleRemove = async (topicId: string) => {
    try {
      const supabase = await createClient()

      // Remove topic from Supabase
      const { error } = await supabase.from('items').delete().eq('id', topicId)
      if (error) {
        throw new Error(error.message)
      }

      // Update local state after successful deletion
      setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== topicId))
    } catch (err) {
      console.error('Error removing topic:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h2 className="text-2xl font-semibold mb-4">Recent Topics</h2>
        <p>Error loading topics: {error}</p>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Topics</h2>
        <p className="text-muted-foreground">No recent topics found.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic, index) => (
  <Link href={`/${topic.id}`} key={topic.id}> {/* Add key prop here */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-60 max-h-60 flex flex-col justify-between relative cursor-pointer hover:shadow-lg transition-shadow">
        {/* Remove Icon */}
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation if clicking the delete button
            handleRemove(topic.id);
          }}
          className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-600 hover:text-white"
        >
          <IoTrashOutline size={20} />
        </Button>

        <CardHeader>
          <CardTitle className="truncate">{topic.title}</CardTitle>
          <CardDescription>{format(new Date(topic.date), 'PP')}</CardDescription>
          {topic.description && (
            <p className="text-gray-400 truncate text-sm mt-1">
              {topic.description.slice(0, 50)}...
            </p>
          )}
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {topic.subjects.slice(0, 3).map((subject) => (
              <span
                key={subject}
                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
              >
                {subject}
              </span>
            ))}
            {topic.subjects.length > 3 && (
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                +{topic.subjects.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
))}
      </div>
    </div>
  )
}

export { refreshTopics as refresh }
