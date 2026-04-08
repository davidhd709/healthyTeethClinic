import { Skeleton } from '@/components/ui/skeleton';
import { SpecialistCardSkeleton } from '@/components/shared/LoadingSkeleton';

export default function EspecialistasLoading() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-80 sm:w-96" />
          <Skeleton className="h-5 w-64 sm:w-80" />
        </div>
      </div>

      {/* Section heading skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center space-y-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-1 w-16 rounded-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        {/* Grid skeleton - 4 columns for specialists */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SpecialistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
