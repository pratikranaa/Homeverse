import { ContentSection } from '@/lib/api/content';
import { HeroSection } from './HeroSection';
import { BenefitsSection, Benefit } from './BenefitsSection';
import { TestimonialsSection, Testimonial } from './TestimonialsSection';
import { FAQSection, FAQItem } from './FAQSection';
import { ContactSection, ContactInfo } from './ContactSection';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { BrokerForm } from '@/components/forms/BrokerForm';
import { BannerSection } from './BannerSection';
import { TextSection } from './TextSection';
import { TeamSection } from './TeamSection';
import { CTASection } from './CTASection';

interface SectionRendererProps {
  section: ContentSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const { type } = section;
  console.log(`Rendering section: ${type}`, Object.keys(section));

  switch (type) {
    case 'hero':
      return (
        <HeroSection
          title={section.title as string}
          subtitle={section.subtitle as string}
          ctaText={section.cta_text as string}
          ctaLink={section.cta_link as string}
          backgroundImage={section.background_image as string}
        />
      );
    case 'banner':
      return (
        <BannerSection
          title={section.title as string}
          subtitle={section.subtitle as string}
          ctaPrimary={section.cta_primary as { text: string; link: string }}
          ctaSecondary={section.cta_secondary as { text: string; link: string }}
          backgroundImage={section.background_image as string}
        />
      );
    case 'benefits':
    case 'features': // Handle features as benefits
      return (
        <BenefitsSection
          title={section.title as string}
          subtitle={section.description as string}
          benefits={(section.benefits || section.items) as Benefit[]}
        />
      );
    case 'testimonials':
      return (
        <TestimonialsSection
          title={section.title as string}
          testimonials={(section.testimonials || section.items) as Testimonial[]}
        />
      );
    case 'faq':
      return (
        <FAQSection
          title={section.title as string}
          items={(section.faqs || section.items) as FAQItem[]}
        />
      );
    case 'text':
      return (
        <TextSection
          title={section.title as string}
          body={section.body as string}
        />
      );
    case 'team':
      return (
        <TeamSection
          title={section.title as string}
          members={(section.members || section.items) as any[]}
        />
      );
    case 'contact':
      return (
        <ContactSection
          title={section.title as string}
          subtitle={section.description as string}
          contactInfo={{
            address: section.address as string,
            email: section.email as string,
            phone: section.phone as string,
            hours: section.hours as string,
            map_url: section.map_url as string,
          }}
        />
      );
    case 'cta':
      return (
        <CTASection
          title={section.title as string}
          subtitle={section.description as string}
        />
      );
    default:
      return null;
  }
}
