import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  name: string;
  className?: string;
}

export function CategoryBadge({ name, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
        className
      )}
    >
      {name}
    </span>
  );
}
