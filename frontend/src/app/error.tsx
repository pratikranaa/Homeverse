'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Something went wrong!</h2>
      <div className="mb-8 max-w-md">
        <ErrorMessage message={error.message || 'An unexpected error occurred. Please try again.'} />
      </div>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        variant="primary"
        size="lg"
      >
        Try again
      </Button>
    </div>
  );
}
