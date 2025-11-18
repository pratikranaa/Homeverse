interface TeamMember {
    name: string;
    role: string;
    image: string;
    bio: string;
}

interface TeamSectionProps {
    title: string;
    members: TeamMember[];
}

export function TeamSection({ title, members = [] }: TeamSectionProps) {
    if (!members || members.length === 0) {
        return null;
    }
    return (
        <section className="bg-muted/50 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h2>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                            <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                            <p className="text-muted-foreground">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
