'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, DollarSign, Shield, Clock, Users, Search, LifeBuoy, BarChart, Megaphone, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// Map icon names to Lucide components
const iconMap = {
  check: CheckCircle,
  home: Home,
  dollar: DollarSign,
  shield: Shield,
  clock: Clock,
  users: Users,
  // API icons
  search: Search,
  support: LifeBuoy,
  chart: BarChart,
  megaphone: Megaphone,
  handshake: Handshake,
};

export interface Benefit {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

interface BenefitsSectionProps {
  title: string;
  subtitle?: string;
  benefits: Benefit[];
  className?: string;
}

export function BenefitsSection({
  title,
  subtitle,
  benefits = [],
  className,
}: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || CheckCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-none bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
