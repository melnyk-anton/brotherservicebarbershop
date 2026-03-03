"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
    { number: 1, label: "Послуга" },
    { number: 2, label: "Майстер" },
    { number: 3, label: "Дата" },
    { number: 4, label: "Дані" },
    { number: 5, label: "Запис" },
];

interface StepIndicatorProps {
    currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    {/* Step circle */}
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                currentStep > step.number
                                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                    : currentStep === step.number
                                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                        : "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]"
                            )}
                        >
                            {currentStep > step.number ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-[10px] sm:text-xs font-medium hidden sm:block",
                                currentStep >= step.number
                                    ? "text-[hsl(var(--foreground))]"
                                    : "text-[hsl(var(--muted-foreground))]"
                            )}
                        >
                            {step.label}
                        </span>
                    </div>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "mx-1 sm:mx-2 h-0.5 w-6 sm:w-10 transition-colors",
                                currentStep > step.number
                                    ? "bg-[hsl(var(--primary))]"
                                    : "bg-[hsl(var(--secondary))]"
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
