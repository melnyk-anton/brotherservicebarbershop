"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Barber } from "@/lib/supabase/types";

interface BarberStepProps {
    barbers: Barber[];
    selected: Barber | null;
    anyBarber: boolean;
    onSelect: (barber: Barber | null, anyBarber: boolean) => void;
}

export function BarberStep({
    barbers,
    selected,
    anyBarber,
    onSelect,
}: BarberStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Оберіть майстра</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Виберіть майстра або оберіть будь-якого вільного
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {/* Any barber option */}
                <Card
                    className={cn(
                        "cursor-pointer transition-all duration-200 hover:border-[hsl(var(--primary))]/50",
                        anyBarber
                            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                            : "border-[hsl(var(--border))]"
                    )}
                    onClick={() => onSelect(null, true)}
                >
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--secondary))]">
                            <Users className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Будь-який майстер</h3>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                Перший вільний майстер
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Individual barbers */}
                {barbers.map((barber) => (
                    <Card
                        key={barber.id}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:border-[hsl(var(--primary))]/50",
                            !anyBarber && selected?.id === barber.id
                                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                                : "border-[hsl(var(--border))]"
                        )}
                        onClick={() => onSelect(barber, false)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--secondary))]">
                                {barber.image_url ? (
                                    <img
                                        src={barber.image_url}
                                        alt={barber.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold">{barber.name}</h3>
                                <Badge variant="outline" className="text-xs mt-0.5">
                                    {barber.title}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
