// src/components/hotel/HotelCardSkeleton.tsx
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function HotelCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <Card className="flex h-full flex-col overflow-hidden lg:flex-row">
        <Skeleton className="aspect-4/3 w-full rounded-none lg:aspect-auto lg:w-72" />
        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </Card>
  );
}