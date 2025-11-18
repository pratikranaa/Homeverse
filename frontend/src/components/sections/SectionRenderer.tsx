import { ContentSection } from '@/lib/api/content';
import { HeroSection } from './HeroSection';
import { BenefitsSection, Benefit } from './BenefitsSection';
import { TestimonialsSection, Testimonial } from './TestimonialsSection';
import { FAQSection, FAQItem } from './FAQSection';
import { ContactSection, ContactInfo } from './ContactSection';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { BrokerForm } from '@/components/forms/BrokerForm';

interface SectionRendererProps {
  section: ContentSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const { section_type, content } = section;

  switch (section_type) {
    case 'hero':
      return (
        <HeroSection
          title={content.title as string}
          subtitle={content.subtitle as string}
          ctaText={content.cta_text as string}
          ctaLink={content.cta_link as string}
          backgroundImage={content.background_image as string}
        />
      );
    case 'benefits':
      return (
        <BenefitsSection
          title={content.title as string}
          subtitle={content.description as string}
          benefits={content.benefits as Benefit[]}
        />
      );
    case 'testimonials':
      return (
        <TestimonialsSection
          title={content.title as string}
          testimonials={content.testimonials as Testimonial[]}
        />
      );
    case 'faq':
      return (
        <FAQSection
          title={content.title as string}
          items={content.faqs as FAQItem[]}
        />
      );
    case 'contact':
      return (
        <ContactSection
          title={content.title as string}
          subtitle={content.description as string}
          contactInfo={content.contact_info as ContactInfo}
        />
      );
    case 'cta':
      // Special handling for CTA section which might contain forms
      return (
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold">{content.title as string || 'Contact Us'}</h2>
                <p className="mb-8 text-muted-foreground">
                  {content.description as string || 'Fill out the form below to get in touch.'}
                </p>
                <CallbackForm />
              </div>
              <div>
                <h2 className="mb-4 text-3xl font-bold">Are you a Broker?</h2>
                <p className="mb-8 text-muted-foreground">
                  Join our network of successful brokers.
                </p>
                <BrokerForm />
              </div>
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
}
