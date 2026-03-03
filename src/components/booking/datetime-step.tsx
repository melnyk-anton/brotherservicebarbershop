"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isBefore, startOfDay, getDay } from "date-fns";
import { uk } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { generateTimeSlots } from "@/lib/booking/slots";
import { createClient } from "@/lib/supabase/client";
import type { TimeSlot } from "@/lib/booking/types";

const KYIV_TZ = "Europe/Kyiv";
const MAX_ADVANCE_DAYS = 30;

interface DateTimeStepProps {
    barberId: string | null;
    anyBarber: boolean;
    durationMinutes: number;
    onSelectSlot: (slotStartUtc: string) => void;
    selectedSlot: string | null;
}

export function DateTimeStep({
    barberId,
    anyBarber,
    durationMinutes,
    onSelectSlot,
    selectedSlot,
}: DateTimeStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);

    const nowKyiv = toZonedTime(new Date(), KYIV_TZ);
    const todayKyiv = startOfDay(nowKyiv);
    const maxDate = addDays(todayKyiv, MAX_ADVANCE_DAYS);

    const isDisabledDate = useCallback(
        (date: Date) => {
            // Disable Sundays (getDay === 0)
            if (getDay(date) === 0) return true;
            // Disable past dates
            if (isBefore(date, todayKyiv)) return true;
            // Disable dates too far in advance
            if (isBefore(maxDate, date)) return true;
            return false;
        },
        [todayKyiv, maxDate]
    );

    useEffect(() => {
        if (!selectedDate) return;

        let cancelled = false;

        async function fetchSlots() {
            setLoading(true);
            try {
                const supabase = createClient();

                // Format the date for the query
                const dateStr = format(selectedDate!, "yyyy-MM-dd");

                // Fetch existing bookings for this date
                let query = supabase
                    .from("bookings")
                    .select("start_time, end_time, barber_id")
                    .eq("date", dateStr)
                    .neq("status", "cancelled");

                if (!anyBarber && barberId) {
                    query = query.eq("barber_id", barberId);
                }

                const { data: bookings, error } = await query;

                if (error) {
                    console.error("Error fetching bookings:", error);
                    return;
                }

                if (cancelled) return;

                const generatedSlots = generateTimeSlots(
                    selectedDate!,
                    durationMinutes,
                    bookings ?? [],
                    anyBarber ? null : barberId
                );

                setSlots(generatedSlots);
            } catch (err) {
                console.error("Error generating slots:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchSlots();

        return () => {
            cancelled = true;
        };
    }, [selectedDate, barberId, anyBarber, durationMinutes]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Дата та час</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Оберіть зручну дату та час
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                {/* Calendar */}
                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDisabledDate}
                        locale={uk}
                        className="rounded-lg border border-[hsl(var(--border))]"
                    />
                </div>

                {/* Time Slots */}
                <div>
                    {!selectedDate && (
                        <div className="flex h-full items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
                            Оберіть дату для перегляду вільних годин
                        </div>
                    )}

                    {selectedDate && loading && (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
                        </div>
                    )}

                    {selectedDate && !loading && slots.length === 0 && (
                        <div className="flex h-full items-center justify-center text-sm text-[hsl(var(--muted-foreground))]">
                            На цю дату немає вільних годин
                        </div>
                    )}

                    {selectedDate && !loading && slots.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                                Доступні години на{" "}
                                {format(selectedDate, "d MMMM", { locale: uk })}:
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {slots.map((slot) => (
                                    <Button
                                        key={slot.startUtc}
                                        variant={
                                            selectedSlot === slot.startUtc ? "default" : "outline"
                                        }
                                        size="sm"
                                        disabled={!slot.available}
                                        onClick={() => onSelectSlot(slot.startUtc)}
                                        className={cn(
                                            "text-sm",
                                            !slot.available && "opacity-40 line-through"
                                        )}
                                    >
                                        {slot.display}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
