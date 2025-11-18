'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

export function FAQSection({
  title,
  subtitle,
  items = [],
  className,
}: FAQSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const contentId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <div
                key={index}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <button
                  id={headerId}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left font-medium transition-all hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                  aria-expanded={openIndex === index}
                  aria-controls={contentId}
                >
                  <span className="text-lg">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform duration-200',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-muted-foreground">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
