import { cn } from '@/lib/utils';

interface BlogContentProps {
  content: string;
  className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
  // In a real application, you might want to use a markdown parser or a rich text renderer
  // depending on how Strapi returns the content. 
  // If it's markdown, use react-markdown. If it's HTML, use dangerouslySetInnerHTML (with sanitization).
  // Assuming Strapi returns markdown or we handle it as such for now, or simple HTML.
  // For this example, I'll assume it's HTML string from a rich text editor.

  return (
    <div 
      className={cn(
        'prose prose-slate max-w-none dark:prose-invert',
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-lg prose-img:shadow-md',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
