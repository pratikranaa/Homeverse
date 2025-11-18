import { Metadata } from 'next';
import { getBuyerLandingContent } from '@/lib/api/content';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'Real Estate - Find Your Dream Home',
  description: 'Discover the best properties in your area with our expert real estate services.',
};

export default async function HomePage() {
  const pageContent = await getBuyerLandingContent();

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

