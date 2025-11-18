import { Metadata } from 'next';
import { getAboutContent } from '@/lib/api/content';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export const metadata: Metadata = {
  title: 'About Us | Real Estate Platform',
  description: 'Learn more about our mission, vision, and the team behind our real estate platform.',
};

export default async function AboutPage() {
  const pageContent = await getAboutContent();

  return (
    <main className="min-h-screen">
      {/* If the API returns a title/description for the page itself, we could display it here, 
          but usually the sections cover it. */}
      
      <div className="flex flex-col gap-0">
        {pageContent.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </main>
  );
}
