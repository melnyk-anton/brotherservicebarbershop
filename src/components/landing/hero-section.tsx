"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Star } from "lucide-react";

const ProceduralGroundBackground = dynamic(
    () => import("@/components/ui/animated-pattern-cloud"),
    { ssr: false }
);

export function HeroSection() {
    return (
        <section className="relative flex min-h-[150vh] flex-col overflow-hidden px-8 pt-40 lg:px-20">
            {/* WebGL background */}
            <ProceduralGroundBackground />

            {/* Main content */}
            <div className="relative z-10 flex w-full flex-1 flex-col justify-between pb-20">
                {/* Top: Heading + CTA */}
                <div className="flex flex-col items-center gap-8 text-center">
                    <h1 className="font-display text-7xl font-bold tracking-[-0.04em] lg:text-9xl">
                        BROTHER <br />
                        <span className="text-[hsl(187,71%,50%)]">SERVICE</span>
                    </h1>
                    <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-400">
                        Стиль. Братерство. Якість.
                        <br />
                        Твій барбершоп з характером та увагою до деталей.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                        <Link
                            href="/book"
                            className="inline-flex items-center gap-3 rounded-full bg-[hsl(187,71%,50%)] px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-[hsl(187,71%,45%)] hover:gap-4"
                        >
                            Записатися онлайн
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#services"
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-4 text-base font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
                        >
                            Наші послуги
                        </Link>
                    </div>
                </div>

                {/* Bottom: Info strip */}
                <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-zinc-800/60 pt-10">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50">
                            <MapPin className="h-5 w-5 text-[hsl(187,71%,50%)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Адреса</p>
                            <p className="mt-1 text-base font-medium text-white">м. Рівне, Степана Бандери, 60А</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50">
                            <Clock className="h-5 w-5 text-[hsl(187,71%,50%)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Графік</p>
                            <p className="mt-1 text-base font-medium text-white">Пн–Сб 9:00–21:00</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50">
                            <Star className="h-5 w-5 text-[hsl(187,71%,50%)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Рейтинг</p>
                            <p className="mt-1 text-base font-medium text-white">4.9 — Google Maps</p>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
