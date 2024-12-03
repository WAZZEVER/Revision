import { ScrollArea } from "@/components/ui/scroll-area"

const scheduleItems = [
  { time: "09:00 AM", task: "Team Meeting" },
  { time: "11:00 AM", task: "Client Call" },
  { time: "02:00 PM", task: "Project Review" },
  { time: "04:00 PM", task: "Coding Session" },
  { time: "06:00 PM", task: "Wrap-up and Planning" },
]

export default function Schedule() {
  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm font-medium">{item.time}</span>
            <span className="text-sm text-muted-foreground">{item.task}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

