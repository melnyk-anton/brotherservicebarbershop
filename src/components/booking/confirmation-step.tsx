"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, AlertCircle, User, Scissors, CalendarDays, Phone } from "lucide-react";
import { formatTimeKyiv, formatDateKyiv } from "@/lib/booking/slots";
import { formatPhoneForDisplay } from "@/lib/booking/validation";
import type { BookingState } from "@/lib/booking/types";

interface ConfirmationStepProps {
    state: BookingState;
    onConfirm: () => Promise<void>;
    onReset: () => void;
}

export function ConfirmationStep({
    state,
    onConfirm,
    onReset,
}: ConfirmationStepProps) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async () => {
        setStatus("submitting");
        setErrorMsg("");
        try {
            await onConfirm();
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setErrorMsg(
                err instanceof Error ? err.message : "Щось пішло не так. Спробуйте ще раз."
            );
        }
    };

    if (status === "success") {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Запис підтверджено!</h2>
                    <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                        Очікуйте на вас{" "}
                        {state.date && formatDateKyiv(state.date)} о{" "}
                        {state.timeSlot && formatTimeKyiv(state.timeSlot)}
                    </p>
                </div>
                <Button onClick={onReset} variant="outline">
                    Новий запис
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Підтвердження</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Перевірте дані та підтвердіть запис
                </p>
            </div>

            <Card className="border-[hsl(var(--border))]">
                <CardContent className="p-6 space-y-4">
                    {/* Service */}
                    <div className="flex items-center gap-3">
                        <Scissors className="h-4 w-4 text-[hsl(var(--primary))]" />
                        <div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Послуга</p>
                            <p className="font-medium">
                                {state.service?.name} — {state.service?.price_uah} ₴
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Barber */}
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                        <div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Майстер</p>
                            <p className="font-medium">{state.barber?.name}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Date & Time */}
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-4 w-4 text-[hsl(var(--primary))]" />
                        <div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Дата та час</p>
                            <p className="font-medium">
                                {state.date && formatDateKyiv(state.date)},{" "}
                                {state.timeSlot && formatTimeKyiv(state.timeSlot)}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer */}
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-[hsl(var(--primary))]" />
                        <div>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Клієнт</p>
                            <p className="font-medium">
                                {state.customerName} · {formatPhoneForDisplay(state.customerPhone)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 p-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-[hsl(var(--destructive))]" />
                    <span>{errorMsg}</span>
                </div>
            )}

            <Button
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className="w-full"
                size="lg"
            >
                {status === "submitting" ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Бронюємо...
                    </>
                ) : (
                    "Підтвердити запис"
                )}
            </Button>
        </div>
    );
}
