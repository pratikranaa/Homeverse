import { Skeleton } from '@/components/ui/Skeleton';

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-3/4 max-w-lg" />
        <Skeleton className="mx-auto h-6 w-1/2 max-w-md" />
      </div>

      <div className="space-y-16">
        {/* Hero Section Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>

        {/* Content Section Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Team/Benefits Section Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
