import { Metadata } from 'next';
import { getHomeContent, getBuyerLandingContent } from '@/lib/api/content';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'Real Estate - Find Your Dream Home',
  description: 'Discover the best properties in your area with our expert real estate services.',
};

export default async function HomePage() {
  const [homeContent, buyerContent] = await Promise.all([
    getHomeContent(),
    getBuyerLandingContent(),
  ]);

  // Filter out sections we want to arrange specifically
  const buyerHero = buyerContent.sections.find(s => s.type === 'hero');
  const buyerFeatures = buyerContent.sections.find(s => s.type === 'features');
  const buyerCTA = buyerContent.sections.find(s => s.type === 'cta');

  const homeBanner = homeContent.sections.find(s => s.type === 'banner');
  const homeTestimonials = homeContent.sections.find(s => s.type === 'testimonials');
  const homeFAQ = homeContent.sections.find(s => s.type === 'faq');

  // Construct the merged sections array in the desired order
  const mergedSections = [
    buyerHero,
    buyerFeatures,
    homeBanner,
    homeTestimonials,
    homeFAQ,
    buyerCTA,
  ].filter(Boolean); // Remove undefined sections if any are missing

  return (
    <main className="flex min-h-screen flex-col">
      {mergedSections.map((section) => (
        <SectionRenderer key={`${section!.id}-${section!.type}`} section={section!} />
      ))}
    </main>
  );
}

