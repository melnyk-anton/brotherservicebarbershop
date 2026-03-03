"use client";

import { useReducer } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import { ServiceStep } from "./service-step";
import { BarberStep } from "./barber-step";
import { DateTimeStep } from "./datetime-step";
import { DetailsStep } from "./details-step";
import { ConfirmationStep } from "./confirmation-step";
import {
    bookingReducer,
    initialBookingState,
} from "@/lib/booking/types";
import type { Barber, Service } from "@/lib/supabase/types";

interface BookingWizardProps {
    services: Service[];
    barbers: Barber[];
}

export function BookingWizard({ services, barbers }: BookingWizardProps) {
    const [state, dispatch] = useReducer(bookingReducer, initialBookingState);

    const handleConfirm = async () => {
        if (!state.service || !state.timeSlot) {
            throw new Error("Дані бронювання неповні");
        }

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: state.service.id,
                barber_id: state.anyBarber ? null : state.barber?.id,
                any_barber: state.anyBarber,
                start_time: state.timeSlot,
                customer_name: state.customerName.trim(),
                customer_phone: state.customerPhone.replace(/\s/g, ""),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Помилка бронювання");
        }
    };

    const canGoBack = state.step > 1 && state.step <= 5;

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <StepIndicator currentStep={state.step} />

            {/* Back Button */}
            {canGoBack && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch({ type: "GO_TO_STEP", payload: state.step - 1 })}
                    className="gap-1 text-[hsl(var(--muted-foreground))]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Назад
                </Button>
            )}

            {/* Steps */}
            {state.step === 1 && (
                <ServiceStep
                    services={services}
                    selected={state.service}
                    onSelect={(service) =>
                        dispatch({ type: "SET_SERVICE", payload: service })
                    }
                />
            )}

            {state.step === 2 && (
                <BarberStep
                    barbers={barbers}
                    selected={state.barber}
                    anyBarber={state.anyBarber}
                    onSelect={(barber, anyBarber) =>
                        dispatch({ type: "SET_BARBER", payload: barber, anyBarber })
                    }
                />
            )}

            {state.step === 3 && (
                <DateTimeStep
                    barberId={state.barber?.id ?? null}
                    anyBarber={state.anyBarber}
                    durationMinutes={state.service?.duration_minutes ?? 30}
                    selectedSlot={state.timeSlot}
                    onSelectSlot={(slot) =>
                        dispatch({ type: "SET_TIME_SLOT", payload: slot })
                    }
                />
            )}

            {state.step === 4 && (
                <DetailsStep
                    customerName={state.customerName}
                    customerPhone={state.customerPhone}
                    onNameChange={(name) =>
                        dispatch({ type: "SET_CUSTOMER_NAME", payload: name })
                    }
                    onPhoneChange={(phone) =>
                        dispatch({ type: "SET_CUSTOMER_PHONE", payload: phone })
                    }
                    onContinue={() => dispatch({ type: "GO_TO_STEP", payload: 5 })}
                />
            )}

            {state.step === 5 && (
                <ConfirmationStep
                    state={state}
                    onConfirm={handleConfirm}
                    onReset={() => dispatch({ type: "RESET" })}
                />
            )}
        </div>
    );
}
