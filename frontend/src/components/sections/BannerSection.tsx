import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BannerSectionProps {
    title: string;
    subtitle: string;
    ctaPrimary?: {
        text: string;
        link: string;
    };
    ctaSecondary?: {
        text: string;
        link: string;
    };
    backgroundImage?: string;
}

export function BannerSection({
    title,
    subtitle,
    ctaPrimary,
    ctaSecondary,
    backgroundImage,
}: BannerSectionProps) {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={backgroundImage}
                        alt="Banner background"
                        className="h-full w-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
                </div>
            )}

            <div className="container relative z-10 mx-auto px-4 text-center">
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    {title}
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
                    {subtitle}
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    {ctaPrimary && (
                        <Link
                            href={ctaPrimary.link}
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {ctaPrimary.text}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    )}

                    {ctaSecondary && (
                        <Link
                            href={ctaSecondary.link}
                            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {ctaSecondary.text}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
