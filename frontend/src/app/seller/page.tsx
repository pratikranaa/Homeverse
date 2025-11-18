import { Metadata } from 'next';
import { getSellerLandingContent } from '@/lib/api/content';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'Sell Your Property - Real Estate',
  description: 'Get the best value for your property with our expert selling services.',
};

export default async function SellerPage() {
  const pageContent = await getSellerLandingContent();

  return (
    <main className="flex min-h-screen flex-col">
      {pageContent.sections
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
    </main>
  );
}
