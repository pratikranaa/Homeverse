import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export interface ContactInfo {
  address?: string;
  email?: string;
  phone?: string;
  hours?: string;
  map_url?: string;
}

interface ContactSectionProps {
  title: string;
  subtitle?: string;
  contactInfo: ContactInfo;
}

export function ContactSection({ title, subtitle, contactInfo }: ContactSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.address && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Visit Us</h3>
              <p className="text-muted-foreground">{contactInfo.address}</p>
            </div>
          )}

          {contactInfo.email && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Email Us</h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-muted-foreground hover:text-primary"
              >
                {contactInfo.email}
              </a>
            </div>
          )}

          {contactInfo.phone && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Call Us</h3>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-muted-foreground hover:text-primary"
              >
                {contactInfo.phone}
              </a>
            </div>
          )}

          {contactInfo.hours && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Opening Hours</h3>
              <p className="text-muted-foreground">{contactInfo.hours}</p>
            </div>
          )}
        </div>

        {contactInfo.map_url && (
          <div className="mt-12 overflow-hidden rounded-lg shadow-lg">
            <iframe
              src={contactInfo.map_url}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
}
