"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { loginAction, registerAction } from "@/app/account/actions";

interface AuthFormProps {
    mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const action = mode === "login" ? loginAction : registerAction;
            const result = await action(formData);
            if (result?.error) setError(result.error);
            if (result && "success" in result && result.success) setSuccess(result.success as string);
        });
    };

    return (
        <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Ім'я</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="Ваше ім'я"
                                    required
                                    minLength={2}
                                    className="border-zinc-700 bg-zinc-800/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Телефон</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+380XXXXXXXXX"
                                    className="border-zinc-700 bg-zinc-800/50"
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@gmail.com"
                            required
                            className="border-zinc-700 bg-zinc-800/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                placeholder={mode === "register" ? "Мінімум 6 символів" : "Ваш пароль"}
                                required
                                minLength={6}
                                className="border-zinc-700 bg-zinc-800/50 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-400">
                            <span>✉️ {success}</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                        size="lg"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "login" ? "Вхід..." : "Реєстрація..."}
                            </>
                        ) : (
                            mode === "login" ? "Увійти" : "Зареєструватися"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
