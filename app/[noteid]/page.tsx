'use client'; // Mark as a client-side component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import DashboardContent from './dashboard-content';

type Topic = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  subjects: string[];
  created_at: string;
};

export default function NotePage({ params }: { params: { noteid: string } }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { noteid } = await params; // Unwrap the params Promise to get the noteid
        const supabase = createClient();

        // Get the logged-in user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          throw new Error('You must be logged in to access this page.');
        }

        // Fetch the note and validate the user is the owner
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', noteid) // Use noteid from params
          .single();

        if (error || !data) {
          throw new Error('Note not found.');
        }

        if (data.user_id !== userData.user.id) {
          throw new Error('You do not have permission to view this note.');
        }

        setTopic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [params]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!topic) return <p>No note found.</p>;

  return (
    <>
      {/* Pass topic as prop to DashboardContent */}
      <DashboardContent title={topic.title} description={topic.description || 'Do your best!'} eventDate={topic.date} />
    </>
  );
}
