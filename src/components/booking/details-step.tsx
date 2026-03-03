"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateName, validatePhone } from "@/lib/booking/validation";

interface DetailsStepProps {
    customerName: string;
    customerPhone: string;
    onNameChange: (name: string) => void;
    onPhoneChange: (phone: string) => void;
    onContinue: () => void;
}

export function DetailsStep({
    customerName,
    customerPhone,
    onNameChange,
    onPhoneChange,
    onContinue,
}: DetailsStepProps) {
    const isNameValid = validateName(customerName);
    const isPhoneValid = validatePhone(customerPhone);
    const canContinue = isNameValid && isPhoneValid;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Ваші дані</h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                    Заповніть контактну інформацію
                </p>
            </div>

            <div className="max-w-md space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Ім&apos;я</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Ваше ім'я"
                        value={customerName}
                        onChange={(e) => onNameChange(e.target.value)}
                        className={
                            customerName.length > 0 && !isNameValid
                                ? "border-[hsl(var(--destructive))]"
                                : ""
                        }
                    />
                    {customerName.length > 0 && !isNameValid && (
                        <p className="text-xs text-[hsl(var(--destructive))]">
                            Мінімум 2 символи
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+380XXXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        className={
                            customerPhone.length > 0 && !isPhoneValid
                                ? "border-[hsl(var(--destructive))]"
                                : ""
                        }
                    />
                    {customerPhone.length > 0 && !isPhoneValid && (
                        <p className="text-xs text-[hsl(var(--destructive))]">
                            Формат: +380XXXXXXXXX
                        </p>
                    )}
                </div>

                <Button
                    onClick={onContinue}
                    disabled={!canContinue}
                    className="w-full mt-4"
                >
                    Продовжити
                </Button>
            </div>
        </div>
    );
}
