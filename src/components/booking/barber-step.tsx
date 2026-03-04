"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Barber } from "@/lib/supabase/types";

interface BarberStepProps {
    barbers: Barber[];
    selected: Barber | null;
    onSelect: (barber: Barber) => void;
}

function getInitials(name: string): string {
    return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}

export function BarberStep({ barbers, selected, onSelect }: BarberStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Оберіть майстра</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Ціни залежать від майстра — оберіть, і ми покажемо доступні послуги
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {barbers.map((barber) => (
                    <Card
                        key={barber.id}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:border-[hsl(var(--primary))]/50",
                            selected?.id === barber.id
                                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                                : "border-[hsl(var(--border))]"
                        )}
                        onClick={() => onSelect(barber)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                                {barber.image_url ? (
                                    <img
                                        src={barber.image_url}
                                        alt={barber.name}
                                        className="h-12 w-12 rounded-full object-cover object-top"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                                        {getInitials(barber.name)}
                                    </span>
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
