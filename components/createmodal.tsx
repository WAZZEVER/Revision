import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/client'
import { refresh } from '@/components/recent-topics'

// Predefined list of subjects
const SUBJECT_OPTIONS = [
  'Technology',
  'Science',
  'Art',
  'Literature',
  'History',
  'Philosophy',
  'Psychology',
  'Business',
  'Education',
  'Other'
]

// Zod validation schema
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  subjects: z.array(z.string()).max(10, { message: "Maximum 10 subjects allowed." }),
  description: z.string().optional(),
  date: z.date()
})

export default function CreateItemModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [subjects, setSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState('') // For manual subject input

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subjects: [],
      description: '',
      date: new Date()
    }
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = await createClient()
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('items') // Adjust table name as needed
        .insert({
          title: values.title,
          subjects: values.subjects,
          description: values.description,
          date: values.date.toISOString(),
          user_id: userData.user.id
        })

      if (error) throw error

      // Reset form completely
      form.reset({
        title: '',
        subjects: [],
        description: '',
        date: new Date()
      })
      
      // Clear local state
      setSubjects([])
      setCustomSubject('')
      setIsOpen(false)

      // Refresh data after successful creation
      refresh()
      console.log('Item created successfully')
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    const currentSubjects = form.getValues('subjects')
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject].slice(0, 10) // Limit to 10 subjects

    form.setValue('subjects', newSubjects)
    setSubjects(newSubjects)
  }

  // Remove a subject
  const removeSubject = (subjectToRemove: string) => {
    const newSubjects = subjects.filter(s => s !== subjectToRemove)
    form.setValue('subjects', newSubjects)
    setSubjects(newSubjects)
  }

  // Add custom subject
  const addCustomSubject = () => {
    const trimmedSubject = customSubject.trim()
    if (trimmedSubject && 
        !subjects.includes(trimmedSubject) && 
        subjects.length < 10) {
      toggleSubject(trimmedSubject)
      setCustomSubject('')
    }
  }

  // Render subjects with "more" indicator if needed
  const renderSubjects = () => {
    if (subjects.length === 0) return "Select subjects"
    
    if (subjects.length <= 10) {
      return subjects.join(', ')
    }
    
    return `${subjects.slice(0, 10).join(', ')} +${subjects.length - 10} more`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Create
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subjects Selection */}
            <FormItem>
              <FormLabel>Subjects</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {renderSubjects()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search subjects..." />
                    <CommandList>
                      <CommandEmpty>No subjects found.</CommandEmpty>
                      <CommandGroup>
                        {SUBJECT_OPTIONS.map((subject) => (
                          <CommandItem
                            key={subject}
                            value={subject}
                            onSelect={() => toggleSubject(subject)}
                            disabled={subjects.length >= 10}
                          >
                            <div
                              className={cn(
                                "mr-2 h-4 w-4 border border-primary",
                                subjects.includes(subject)
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50"
                              )}
                            >
                              {subjects.includes(subject) ? "✓" : ""}
                            </div>
                            {subject}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Custom Subject Input */}
              <div className="flex mt-2">
                <Input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter custom subject"
                  disabled={subjects.length >= 10}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomSubject()
                    }
                  }}
                />
                <Button 
                  type="button"
                  onClick={addCustomSubject} 
                  className="ml-2"
                  disabled={subjects.length >= 10}
                >
                  Add
                </Button>
              </div>

              {/* Selected Subjects Display */}
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.map((subject) => (
                    <div 
                      key={subject} 
                      className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {subject}
                      <XIcon 
                        className="ml-2 h-4 w-4 cursor-pointer hover:text-destructive" 
                        onClick={() => removeSubject(subject)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <FormMessage>{form.formState.errors.subjects?.message}</FormMessage>
            </FormItem>

            {/* Description Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}