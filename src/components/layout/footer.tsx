import { MapPin, Clock, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-4">
                        <span className="text-lg font-bold tracking-tight uppercase">
                            Brother<span className="text-[hsl(var(--primary))]"> Service</span>
                        </span>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xs">
                            Сучасний чоловічий барбершоп у Рівному.
                            Стиль, братерство, якість.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">
                            Контакти
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-[hsl(var(--muted-foreground))]" />
                                <span>вул. Степана Бандери, 60А, Рівне</span>
                            </div>
                            <a
                                href="https://www.instagram.com/brotherservice_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                                <Instagram className="h-4 w-4" />
                                <span>Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">
                            Графік роботи
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                <span>Пн – Сб: 09:00 – 21:00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                <span className="text-[hsl(var(--muted-foreground))]">Нд: Зачинено</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[hsl(var(--border))]">
                    <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
                        © {new Date().getFullYear()} Brother Service. Усі права захищені.
                    </p>
                </div>
            </div>
        </footer>
    );
}
