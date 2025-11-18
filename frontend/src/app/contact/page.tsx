import { Metadata } from 'next';
import { getContactContent } from '@/lib/api/content';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { CallbackForm } from '@/components/forms/CallbackForm';

export const metadata: Metadata = {
  title: 'Contact Us | Real Estate Platform',
  description: 'Get in touch with our team for any inquiries or support.',
};

export default async function ContactPage() {
  const pageContent = await getContactContent();

  return (
    <main className="min-h-screen">
      <div className="flex flex-col gap-0">
        {pageContent.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      {/* Fallback if no sections are returned or just to ensure form is present */}
      {pageContent.sections.length === 0 && (
        <div className="container mx-auto px-4 py-12">
          <h1 className="mb-8 text-center text-4xl font-bold">Contact Us</h1>
          <div className="mx-auto max-w-md">
            <CallbackForm />
          </div>
        </div>
      )}
    </main>
  );
}
