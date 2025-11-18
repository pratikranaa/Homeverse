import { Metadata } from 'next';
import { getBlogPosts } from '@/lib/api/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { Pagination } from '@/components/blog/Pagination';

export const metadata: Metadata = {
  title: 'Blog - Real Estate Insights',
  description: 'Read our latest articles on real estate trends, buying tips, and market analysis.',
};

interface BlogsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { data: posts, meta } = await getBlogPosts(currentPage);

  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Our Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights and updates from the world of real estate
        </p>
      </div>

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {meta.pagination.pageCount > 1 && (
        <Pagination
          page={currentPage}
          pageCount={meta.pagination.pageCount}
          className="mt-8"
        />
      )}
    </main>
  );
}
