import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

export function ServiceCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="pb-2">
        <Skeleton className="size-12 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}

export function SpecialistCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="items-center pb-2">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="mt-3 h-5 w-2/3" />
        <Skeleton className="mt-1 h-5 w-24 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div className="mx-auto space-y-2">
          <Skeleton className="mx-auto h-3.5 w-full" />
          <Skeleton className="mx-auto h-3.5 w-full" />
          <Skeleton className="mx-auto h-3.5 w-3/4" />
        </div>
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto h-3.5 w-48" />
      </CardContent>
      <CardFooter className="justify-center pt-2">
        <Skeleton className="h-9 w-32 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

export function PageSkeleton() {
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
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-1 w-16 rounded-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
