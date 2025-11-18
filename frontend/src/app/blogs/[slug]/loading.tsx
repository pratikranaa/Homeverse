import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-6 w-24 rounded-full" />
        <Skeleton className="mx-auto h-12 w-3/4" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      
      <Skeleton className="my-8 aspect-video w-full rounded-lg" />
      
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
