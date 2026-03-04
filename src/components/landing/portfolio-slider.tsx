"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioSliderProps {
    images: string[];
    name: string;
}

export function PortfolioSlider({ images, name }: PortfolioSliderProps) {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) return null;

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className="mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-500 mb-4">
                Роботи
            </p>

            {/* Slider */}
            <div className="relative group/slider overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 aspect-[3/4]">
                {/* Images */}
                <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {images.slice(0, 3).map((url, i) => (
                        <div key={i} className="w-full h-full shrink-0">
                            <img
                                src={url}
                                alt={`${name} — робота ${i + 1}`}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    ))}
                </div>

                {/* Prev button */}
                <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/70 border border-zinc-700 text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[hsl(187,71%,50%)] hover:border-[hsl(187,71%,50%)] hover:text-zinc-950"
                    aria-label="Попереднє фото"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Next button */}
                <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950/70 border border-zinc-700 text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[hsl(187,71%,50%)] hover:border-[hsl(187,71%,50%)] hover:text-zinc-950"
                    aria-label="Наступне фото"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.slice(0, 3).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                                ? "w-5 bg-[hsl(187,71%,50%)]"
                                : "w-1.5 bg-zinc-600 hover:bg-zinc-400"
                                }`}
                            aria-label={`Фото ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
