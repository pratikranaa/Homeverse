import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Author } from '@/lib/api/blog';

interface AuthorInfoProps {
  author: Author;
  date?: string;
  className?: string;
  showBio?: boolean;
}

export function AuthorInfo({ author, date, className, showBio = false }: AuthorInfoProps) {
  const avatarUrl = author.avatar?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${author.avatar.url}`
    : null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {avatarUrl ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={avatarUrl}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {author.name.charAt(0)}
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-sm font-medium">{author.name}</span>
        {date && (
          <span className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
        {showBio && author.bio && (
          <p className="mt-1 text-sm text-muted-foreground">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
