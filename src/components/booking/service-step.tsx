"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { BarberService } from "@/lib/supabase/types";

const categoryLabels: Record<string, string> = {
    main: "Стрижка",
    beard: "Борода",
    combo: "Комбо",
    additional: "Додатково",
    massage: "Масаж",
};

interface ServiceStepProps {
    barberId: string;
    selected: BarberService | null;
    onSelect: (service: BarberService) => void;
}

export function ServiceStep({ barberId, selected, onSelect }: ServiceStepProps) {
    const [services, setServices] = useState<BarberService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const supabase = createClient();
        supabase
            .from("barber_services")
            .select("*")
            .eq("barber_id", barberId)
            .eq("active", true)
            .order("sort_order")
            .then(({ data, error }) => {
                if (!error && data) setServices(data);
                setLoading(false);
            });
    }, [barberId]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Оберіть послугу</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Послуги та ціни цього майстра
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
                </div>
            ) : services.length === 0 ? (
                <p className="text-sm text-[hsl(var(--muted-foreground))] py-8 text-center">
                    Послуги для цього майстра не знайдено
                </p>
            ) : (
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
                                    <div className="text-right shrink-0 ml-2">
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
            )}
        </div>
    );
}
