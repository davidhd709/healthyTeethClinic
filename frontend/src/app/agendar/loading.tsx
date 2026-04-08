import { Skeleton } from '@/components/ui/skeleton';

export default function AgendarLoading() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-72 sm:w-96" />
          <Skeleton className="h-5 w-64 sm:w-80" />
        </div>
      </div>

      {/* Wizard skeleton */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Step indicator skeleton */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              {i < 4 && <Skeleton className="hidden h-0.5 w-12 sm:block" />}
            </div>
          ))}
        </div>

        {/* Step title skeleton */}
        <div className="mb-8 space-y-2 text-center">
          <Skeleton className="mx-auto h-7 w-56" />
          <Skeleton className="mx-auto h-4 w-72" />
        </div>

        {/* Service cards grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Navigation skeleton */}
        <div className="mt-10 flex items-center justify-between">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
