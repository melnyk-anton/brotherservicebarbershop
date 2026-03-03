"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/supabase/types";

const categoryLabels: Record<string, string> = {
    main: "Стрижка",
    beard: "Борода",
    combo: "Комбо",
    additional: "Додатково",
    trainee: "Стажер",
    massage: "Масаж",
};

interface ServiceStepProps {
    services: Service[];
    selected: Service | null;
    onSelect: (service: Service) => void;
}

export function ServiceStep({ services, selected, onSelect }: ServiceStepProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Оберіть послугу</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Виберіть послугу, яка вам потрібна
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className={cn(
                            "cursor-pointer transition-all duration-200 hover:border-[hsl(var(--primary))]/50",
                            selected?.id === service.id
                                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                                : "border-[hsl(var(--border))]"
                        )}
                        onClick={() => onSelect(service)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold">{service.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                                        <Badge variant="secondary" className="text-xs">
                                            {categoryLabels[service.category] ?? service.category}
                                        </Badge>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {service.duration_minutes} хв
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-[hsl(var(--primary))]">
                                        {service.price_uah}
                                    </span>
                                    <span className="text-sm text-[hsl(var(--muted-foreground))]"> ₴</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
