'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '/contact',
  backgroundImage,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[600px] items-center justify-center overflow-hidden bg-muted text-center',
        className
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {backgroundImage ? <span className="text-white">{title}</span> : title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {backgroundImage ? <span className="text-gray-200">{subtitle}</span> : subtitle}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={ctaLink}
              className={buttonVariants('primary', 'lg')}
            >
              {ctaText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
