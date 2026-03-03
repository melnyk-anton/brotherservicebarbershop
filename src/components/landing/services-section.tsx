import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Scissors, Sparkle, HandHelping } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/supabase/types";

const categoryConfig: Record<string, { label: string; number: string }> = {
    main: { label: "Стрижка", number: "01" },
    beard: { label: "Борода", number: "02" },
    combo: { label: "Комбо", number: "03" },
    massage: { label: "Масаж", number: "04" },
    additional: { label: "Додатково", number: "05" },
    trainee: { label: "Стажер", number: "06" },
};

/** Categories to feature on the landing page */
const FEATURED_CATEGORIES = ["main", "beard", "combo", "massage"];

async function getFeaturedServices(): Promise<Record<string, Service[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .in("category", FEATURED_CATEGORIES)
        .order("sort_order");

    if (error) {
        console.error("Error fetching services:", error);
        return {};
    }

    const grouped: Record<string, Service[]> = {};
    for (const service of data ?? []) {
        if (!grouped[service.category]) grouped[service.category] = [];
        grouped[service.category].push(service);
    }

    return grouped;
}

export async function ServicesSection() {
    const grouped = await getFeaturedServices();

    return (
        <section id="services" className="py-24 sm:py-32 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="mb-20 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-[hsl(187,71%,50%)]/60 to-transparent" />
                        <p className="text-sm font-medium tracking-[0.3em] uppercase text-[hsl(187,71%,50%)]">
                            Послуги
                        </p>
                        <div className="h-px flex-1 bg-gradient-to-l from-[hsl(187,71%,50%)]/60 to-transparent" />
                    </div>
                    <h2 className="font-display text-center text-4xl sm:text-6xl font-bold tracking-tight">
                        Що ми пропонуємо
                    </h2>
                </div>

                {/* Services — full-width accordion-style rows per category */}
                <div className="space-y-0">
                    {FEATURED_CATEGORIES.map((cat) => {
                        const services = grouped[cat];
                        if (!services?.length) return null;
                        const config = categoryConfig[cat];

                        return (
                            <div key={cat} className="group/cat">
                                {/* Category divider row */}
                                <div className="flex items-center gap-6 border-t border-zinc-800 py-8">
                                    <span className="font-display text-5xl sm:text-7xl font-bold text-zinc-800 group-hover/cat:text-[hsl(187,71%,50%)]/30 transition-colors duration-500">
                                        {config.number}
                                    </span>
                                    <div>
                                        <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight group-hover/cat:text-[hsl(187,71%,50%)] transition-colors duration-300">
                                            {config.label}
                                        </h3>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            {services.length} {services.length === 1 ? "послуга" : services.length < 5 ? "послуги" : "послуг"}
                                        </p>
                                    </div>
                                </div>

                                {/* Individual services */}
                                <div className="pb-4">
                                    {services.map((service) => (
                                        <Link
                                            key={service.id}
                                            href="/book"
                                            className="group/item flex items-center justify-between py-5 pl-8 sm:pl-20 pr-4 -mx-4 rounded-xl hover:bg-zinc-900/80 transition-all duration-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base sm:text-lg font-medium group-hover/item:text-white transition-colors text-zinc-300 truncate">
                                                    {service.name}
                                                </p>
                                                <div className="mt-1 flex items-center gap-3">
                                                    <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                                                        <Clock className="h-3 w-3" />
                                                        {service.duration_minutes} хв
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-4">
                                                <span className="text-xl sm:text-2xl font-bold tabular-nums text-white">
                                                    {service.price_uah}
                                                    <span className="text-sm font-normal text-zinc-500 ml-1">₴</span>
                                                </span>
                                                <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center opacity-0 -translate-x-3 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:border-[hsl(187,71%,50%)] transition-all duration-300">
                                                    <ArrowRight className="h-3.5 w-3.5 text-[hsl(187,71%,50%)]" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Final border */}
                    <div className="border-t border-zinc-800" />
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center">
                    <Button asChild size="lg" className="gap-3 bg-[hsl(187,71%,50%)] hover:bg-[hsl(187,71%,45%)] text-zinc-950 font-semibold px-8 rounded-full">
                        <Link href="/book">
                            Усі послуги та запис
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
