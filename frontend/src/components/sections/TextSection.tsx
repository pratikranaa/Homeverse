interface TextSectionProps {
    title: string;
    body: string;
}

export function TextSection({ title, body }: TextSectionProps) {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto max-w-3xl px-4 text-center">
                <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    {body}
                </p>
            </div>
        </section>
    );
}
