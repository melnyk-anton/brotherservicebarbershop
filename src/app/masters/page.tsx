import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Barber } from "@/lib/supabase/types";
import { MasterCard } from "@/components/landing/master-card";

export const metadata: Metadata = {
    title: "Майстри — Brother Service Барбершоп",
    description:
        "Познайомтеся з командою майстрів Brother Service. Досвідчені барбери Рівного — стрижка, борода, стиль.",
};

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

export default async function MastersPage() {
    const barbers = await getBarbers();

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Back link */}
            <div className="mx-auto max-w-7xl px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
                >
                    ← Повернутись на головну
                </Link>
            </div>

            {/* Hero Header */}
            <header className="mx-auto max-w-7xl px-6 pt-16 pb-20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-[hsl(187,71%,50%)]/60 to-transparent" />
                    <p className="text-sm font-medium tracking-[0.3em] uppercase text-[hsl(187,71%,50%)]">
                        Команда
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-[hsl(187,71%,50%)]/60 to-transparent" />
                </div>

                <h1 className="font-display text-center text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                    Наші майстри
                </h1>
                <p className="text-center text-zinc-400 max-w-xl mx-auto text-lg">
                    Кожен майстер — це характер, досвід та власний стиль. Обери свого.
                </p>
            </header>

            {/* Masters */}
            <main className="mx-auto max-w-7xl px-6 pb-32">
                {barbers.length === 0 ? (
                    <div className="text-center py-24 text-zinc-500">
                        Наразі немає активних майстрів. Зайдіть пізніше.
                    </div>
                ) : (
                    <div className="space-y-0">
                        {barbers.map((barber, index) => (
                            <MasterCard
                                key={barber.id}
                                barber={barber}
                                index={index}
                                reversed={index % 2 !== 0}
                            />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-24 border-t border-zinc-800 pt-16 text-center">
                    <p className="text-zinc-400 mb-6 text-lg">
                        Готовий до нового іміджу?
                    </p>
                    <Link
                        href="/book"
                        className="inline-flex items-center gap-3 rounded-full bg-[hsl(187,71%,50%)] px-10 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-[hsl(187,71%,45%)] hover:gap-4"
                    >
                        Записатися онлайн
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
