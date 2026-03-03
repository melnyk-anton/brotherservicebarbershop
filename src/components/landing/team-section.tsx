import { createClient } from "@/lib/supabase/server";
import type { Barber } from "@/lib/supabase/types";

async function getBarbers(): Promise<Barber[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("active", true)
        .order("sort_order");

    if (error) {
        console.error("Error fetching barbers:", error);
        return [];
    }

    return data ?? [];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export async function TeamSection() {
    const barbers = await getBarbers();

    return (
        <section id="team" className="py-24 sm:py-32 bg-[hsl(var(--card))]/40">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="mb-12">
                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-[hsl(var(--primary))] mb-3">
                        — Команда
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                        Наші майстри
                    </h2>
                    <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-lg">
                        Професіонали, які знають свою справу. Кожен майстер — це характер та стиль.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-[hsl(var(--border))] border border-[hsl(var(--border))]">
                    {barbers.map((barber) => (
                        <div
                            key={barber.id}
                            className="bg-[hsl(var(--background))] p-6"
                        >
                            {/* Avatar */}
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--border))]">
                                {barber.image_url ? (
                                    <img
                                        src={barber.image_url}
                                        alt={barber.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                                        {getInitials(barber.name)}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-base font-semibold">{barber.name}</h3>
                            <p className="mt-1 text-xs font-medium tracking-wider uppercase text-[hsl(var(--primary))]">
                                {barber.title}
                            </p>

                            {barber.bio && (
                                <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                                    {barber.bio}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
