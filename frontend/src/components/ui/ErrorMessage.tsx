import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function ErrorMessage({ message, className, ...props }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive',
        className
      )}
      {...props}
    >
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
