'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, TrashIcon } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

// Define the type for your card
interface Card {
  id: string; // Changed to string to support UUID
  title: string;
  description?: string;
  last_clicked_at?: string | null;
  parent_id?: string | null; // Changed to string to support UUID
}

// Define the type for the new card input
interface NewCardInput {
  title: string;
  description: string;
}

export default function RecentCards() {
  const router = useRouter();
  const params = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState<NewCardInput>({ title: "", description: "" });
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    // Extract noteid and handle potential array cases
    const extractedParentId = Array.isArray(params.noteid) 
      ? params.noteid[0] // Take the first element if it's an array
      : params.noteid;    // Use it directly if it's a string
  
    console.log("Extracted Parent ID:", extractedParentId);
  
    // Proceed if we have a valid parent ID (UUID string)
    if (extractedParentId) {
      setParentId(extractedParentId);
  
      const fetchCards = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('parent_id', extractedParentId)
          .order('last_clicked_at', { ascending: false });
  
        console.log("Fetch Cards Result:", { data, error });
  
        if (error) {
          console.error("Error fetching cards:", error);
        } else {
          setCards(data || []);
        }
      };
  
      fetchCards();
    } else {
      console.warn("No valid parent ID found");
    }
  }, [params]); // Watch entire params object
  

  const addCard = async () => {
    // Prevent adding a card with empty title
    if (!newCard.title.trim()) {
      console.error("Title cannot be empty");
      return;
    }

    if (!parentId) {
      console.error("No parent ID available to create card");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('cards')
      .insert([
        { 
          title: newCard.title, 
          description: newCard.description,
          parent_id: parentId // Use the parent ID from the URL
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding card:", error);
    } else {
      setCards(prevCards => [...prevCards, data as Card]);
      setNewCard({ title: "", description: "" });
      setIsModalOpen(false);
    }
  };

  const removeCard = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting card:", error);
    } else {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const handleCardClick = async (card: Card) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('cards')
      .update({ last_clicked_at: new Date().toISOString() })
      .eq('id', card.id);
  
    if (error) {
      console.error("Error updating last clicked time:", error);
    } else {
      // Update local state to reflect the new last clicked time
      setCards(prevCards =>
        prevCards.map(prevCard =>
          prevCard.id === card.id ? { ...prevCard, last_clicked_at: new Date().toISOString() } : prevCard
        )
      );
  
      // Navigate to the card's page using parentId/noteId format
      router.push(`/${parentId}/${card.title}`);
    }
  };
  
  // Always render the component, but conditionally show content
  return (
    <div className="space-y-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>Enter a title and description for your new note.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              className="w-full p-2 border rounded"
              value={newCard.title}
              onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            />
            <textarea
              placeholder="Note Description"
              className="w-full p-2 border rounded"
              rows={4}
              value={newCard.description}
              onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
            />
            <Button onClick={addCard} className="w-full">Add Note</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note List */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground mb-4 text-center">No notes yet. Create your first note!</p>
          <Button onClick={() => setIsModalOpen(true)} className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          <AnimatePresence>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  onClick={() => handleCardClick(card)} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                >
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when deleting
                        removeCard(card.id);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {cards.length > 0 && (
        <Button onClick={() => setIsModalOpen(true)} className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Note
        </Button>
      )}
    </div>
  );
}