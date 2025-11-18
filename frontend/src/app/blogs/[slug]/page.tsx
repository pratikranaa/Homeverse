import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/api/blog';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { AuthorInfo } from '@/components/blog/AuthorInfo';
import { BlogContent } from '@/components/blog/BlogContent';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { title, excerpt, seo_title, seo_description, featured_image } = post;
  const imageUrl = featured_image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image.url}`
    : undefined;

  return {
    title: seo_title || title,
    description: seo_description || excerpt,
    openGraph: {
      title: seo_title || title,
      description: seo_description || excerpt,
      images: imageUrl ? [imageUrl] : [],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, content, publishedAt, featured_image, category, author } = post;
  const imageUrl = featured_image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featured_image.url}`
    : null;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: imageUrl ? [imageUrl] : [],
    datePublished: publishedAt,
    author: author ? {
      '@type': 'Person',
      name: author.name,
    } : undefined,
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8 text-center">
        {category && (
          <div className="mb-4 flex justify-center">
            <CategoryBadge name={category.name} />
          </div>
        )}

        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>

        {author && (
          <div className="flex justify-center">
            <AuthorInfo
              author={author}
              date={publishedAt}
              showBio={false}
            />
          </div>
        )}
      </header>

      {imageUrl && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <BlogContent content={content} />

      {author && author.bio && (
        <div className="mt-12 border-t pt-8">
          <h3 className="mb-4 text-lg font-semibold">About the Author</h3>
          <AuthorInfo
            author={author}
            showBio={true}
          />
        </div>
      )}
    </article>
  );
}
