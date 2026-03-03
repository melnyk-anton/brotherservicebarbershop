import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";
import type { Barber } from "@/lib/supabase/types";

interface MasterCardProps {
    barber: Barber;
    index: number;
    reversed?: boolean;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function MasterCard({ barber, index, reversed }: MasterCardProps) {
    return (
        <div className="group border-t border-zinc-800 last:border-b py-16 sm:py-20">
            <div
                className={`flex flex-col gap-12 ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                    } items-start`}
            >
                {/* Portrait side */}
                <div className="w-full lg:w-2/5 shrink-0">
                    <div className="relative">
                        {/* Index number — decorative */}
                        <span className="absolute -top-8 left-0 font-display text-8xl font-bold text-zinc-800 select-none leading-none group-hover:text-[hsl(187,71%,50%)]/20 transition-colors duration-500">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Photo or initials placeholder */}
                        <div className="relative mt-6 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
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

                            {/* Gradient overlay at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-950/80 to-transparent" />

                            {/* Cyan accent line */}
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(187,71%,50%)] transition-all duration-700 group-hover:w-full" />
                        </div>
                    </div>
                </div>

                {/* Info side */}
                <div className="flex-1 pt-4 lg:pt-16">
                    {/* Title label */}
                    <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[hsl(187,71%,50%)] mb-3 flex items-center gap-2">
                        <Scissors className="h-3 w-3" />
                        {barber.title}
                    </p>

                    {/* Name */}
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-8">
                        {barber.name}
                    </h2>

                    {/* Divider */}
                    <div className="w-12 h-px bg-zinc-700 mb-8" />

                    {/* Bio */}
                    {barber.bio && (
                        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mb-10">
                            {barber.bio}
                        </p>
                    )}

                    {/* CTA */}
                    <Link
                        href="/book"
                        className="inline-flex items-center gap-3 rounded-full bg-transparent border border-zinc-700 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[hsl(187,71%,50%)] hover:border-[hsl(187,71%,50%)] hover:text-zinc-950 hover:gap-4 group/btn"
                    >
                        Записатися до {barber.name.split(" ")[0]}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
