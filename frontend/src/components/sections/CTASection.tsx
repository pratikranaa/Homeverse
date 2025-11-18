'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, UserSearch } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { BrokerForm } from '@/components/forms/BrokerForm';
import { cn } from '@/lib/utils';

interface CTASectionProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

type ViewState = 'selection' | 'callback' | 'broker';

export function CTASection({ title, subtitle, className }: CTASectionProps) {
    const [view, setView] = React.useState<ViewState>('selection');

    const handleBack = () => {
        setView('selection');
    };

    return (
        <section className={cn('bg-muted/50 py-16 md:py-24', className)}>
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {title || 'Ready to Get Started?'}
                        </h2>
                        {subtitle && (
                            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
                        )}
                    </div>

                    <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-background p-8 shadow-lg md:p-12">
                        <AnimatePresence mode="wait">
                            {view === 'selection' && (
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center gap-8 py-12"
                                >
                                    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
                                        <Button
                                            size="xl"
                                            variant="outline"
                                            className="flex h-auto flex-col gap-4 p-8 hover:border-primary hover:bg-primary/5"
                                            onClick={() => setView('callback')}
                                        >
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Phone className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-2 text-center">
                                                <h3 className="text-xl font-bold">Get a Callback</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Speak with our experts directly
                                                </p>
                                            </div>
                                        </Button>

                                        <Button
                                            size="xl"
                                            variant="outline"
                                            className="flex h-auto flex-col gap-4 p-8 hover:border-primary hover:bg-primary/5"
                                            onClick={() => setView('broker')}
                                        >
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <UserSearch className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-2 text-center">
                                                <h3 className="text-xl font-bold">Find a Broker</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Connect with a certified broker
                                                </p>
                                            </div>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {view === 'callback' && (
                                <motion.div
                                    key="callback"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="mx-auto max-w-md"
                                >
                                    <div className="mb-6 flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleBack}
                                            className="gap-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </Button>
                                        <h3 className="text-xl font-bold">Request a Callback</h3>
                                    </div>
                                    <CallbackForm />
                                </motion.div>
                            )}

                            {view === 'broker' && (
                                <motion.div
                                    key="broker"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="mx-auto max-w-md"
                                >
                                    <div className="mb-6 flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleBack}
                                            className="gap-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </Button>
                                        <h3 className="text-xl font-bold">Broker Inquiry</h3>
                                    </div>
                                    <BrokerForm />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
