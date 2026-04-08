import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ContactoLoading() {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="bg-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-64 sm:w-80" />
          <Skeleton className="h-5 w-64 sm:w-96" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left column - Contact info skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-1 w-16 rounded-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map placeholder skeleton */}
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>

          {/* Right column - Form skeleton */}
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-28 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
