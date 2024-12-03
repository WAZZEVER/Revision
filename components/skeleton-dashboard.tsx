import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-background border-r p-4">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="bg-background border-b p-4 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <main className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

