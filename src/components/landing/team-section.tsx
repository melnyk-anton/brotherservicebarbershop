import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Barber } from "@/lib/supabase/types";

async function getBarbers(): Promise<Barber[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("active", true)
        .order("sort_order")
        .limit(3);

    if (error) {
        console.error("Error fetching barbers:", error);
        return [];
    }

    // Deduplicate by name+title in case DB has duplicate entries
    const seen = new Set<string>();
    const unique = (data ?? []).filter((b) => {
        const key = `${b.name}__${b.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return unique;
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
        <section id="team" className="py-24 sm:py-32 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6">

                {/* Section Header */}
                <div className="mb-20 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-[hsl(187,71%,50%)]/60 to-transparent" />
                        <p className="text-sm font-medium tracking-[0.3em] uppercase text-[hsl(187,71%,50%)]">
                            Brand Masters
                        </p>
                        <div className="h-px flex-1 bg-gradient-to-l from-[hsl(187,71%,50%)]/60 to-transparent" />
                    </div>
                    <h2 className="font-display text-center text-4xl sm:text-6xl font-bold tracking-tight">
                        Наші майстри
                    </h2>
                    <p className="text-center text-zinc-400 max-w-md mx-auto">
                        Кожен майстер — це характер, досвід та власний стиль.
                    </p>
                </div>

                {/* Masters */}
                <div className="space-y-0">
                    {barbers.map((barber, index) => {
                        const reversed = index % 2 !== 0;
                        return (
                            <div
                                key={barber.id}
                                className="group border-t border-zinc-800 last:border-b py-16 sm:py-20"
                            >
                                <div
                                    className={`flex flex-col gap-10 lg:gap-16 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                                        } items-start`}
                                >
                                    {/* Portrait */}
                                    <div className="w-full lg:w-2/5 shrink-0">
                                        <div className="relative">
                                            {/* Decorative number */}
                                            <span className="absolute -top-6 left-0 font-display text-8xl font-bold text-zinc-800 select-none leading-none group-hover:text-[hsl(187,71%,50%)]/20 transition-colors duration-500">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            {/* Photo */}
                                            <div className="relative mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                                                {barber.image_url ? (
                                                    <img
                                                        src={barber.image_url}
                                                        alt={barber.name}
                                                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <span className="font-display text-7xl font-bold text-zinc-700">
                                                            {getInitials(barber.name)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(187,71%,50%)] transition-all duration-700 group-hover:w-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info + Portfolio */}
                                    <div className="flex-1 pt-0 lg:pt-10">
                                        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[hsl(187,71%,50%)] mb-3 flex items-center gap-2">
                                            <Scissors className="h-3 w-3" />
                                            {barber.title}
                                        </p>

                                        <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6">
                                            {barber.name}
                                        </h3>

                                        <div className="w-12 h-px bg-zinc-700 mb-6" />

                                        {barber.bio && (
                                            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
                                                {barber.bio}
                                            </p>
                                        )}

                                        {/* Portfolio — 3 work photos */}
                                        {barber.portfolio_urls && barber.portfolio_urls.length > 0 && (
                                            <div className="mb-10">
                                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-500 mb-4">
                                                    Роботи
                                                </p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {barber.portfolio_urls.slice(0, 3).map((url, i) => (
                                                        <div
                                                            key={i}
                                                            className="aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                                                        >
                                                            <img
                                                                src={url}
                                                                alt={`${barber.name} — робота ${i + 1}`}
                                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            href="/book"
                                            className="inline-flex items-center gap-3 rounded-full border border-zinc-700 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[hsl(187,71%,50%)] hover:border-[hsl(187,71%,50%)] hover:text-zinc-950 hover:gap-4"
                                        >
                                            Записатися до {barber.name.split(" ")[0]}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="border-t border-zinc-800" />
                </div>

                {/* CTA — book any master */}
                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <p className="text-zinc-400 text-lg">
                        Або просто оберіть зручний час — майстра підберемо разом.
                    </p>
                    <Link
                        href="/book"
                        className="inline-flex items-center gap-3 rounded-full bg-[hsl(187,71%,50%)] px-10 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-[hsl(187,71%,45%)] hover:gap-4"
                    >
                        Записатися до будь-якого майстра
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>

            </div>
        </section>
    );
}
