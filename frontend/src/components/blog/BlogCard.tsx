import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/api/blog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { CategoryBadge } from './CategoryBadge';
import { AuthorInfo } from './AuthorInfo';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const { title, excerpt, slug, publishedAt, featured_image, category, author } = post;

  const imageUrl = featured_image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image.url}`
    : null;

  return (
    <article className="h-full">
      <Link href={`/blogs/${slug}`}>
        <Card className={cn('h-full overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg', className)}>
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          <CardHeader className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              {category && (
                <CategoryBadge name={category.name} />
              )}
            </div>
            <h3 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight">
              {title}
            </h3>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {excerpt}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            {author && (
              <AuthorInfo
                author={author}
                date={publishedAt}
              />
            )}
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
}