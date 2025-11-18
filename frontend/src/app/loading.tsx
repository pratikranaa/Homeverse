import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
