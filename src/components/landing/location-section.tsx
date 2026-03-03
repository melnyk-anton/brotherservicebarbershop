import { MapPin, Clock } from "lucide-react";

const schedule = [
    { day: "Понеділок", hours: "09:00 – 21:00" },
    { day: "Вівторок", hours: "09:00 – 21:00" },
    { day: "Середа", hours: "09:00 – 21:00" },
    { day: "Четвер", hours: "09:00 – 21:00" },
    { day: "П'ятниця", hours: "09:00 – 21:00" },
    { day: "Субота", hours: "09:00 – 21:00" },
    { day: "Неділя", hours: "Зачинено", closed: true },
];

export function LocationSection() {
    return (
        <section id="location" className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="mb-12">
                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-[hsl(var(--primary))] mb-3">
                        — Контакти
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                        Де нас знайти
                    </h2>
                </div>

                <div className="grid gap-12 md:grid-cols-2">
                    {/* Info */}
                    <div className="space-y-8">
                        {/* Address */}
                        <div className="flex items-start gap-4">
                            <MapPin className="h-5 w-5 mt-0.5 text-[hsl(var(--primary))] shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Адреса</h3>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    вул. Степана Бандери, 60А
                                    <br />
                                    Рівне, Рівненська обл., 33023
                                </p>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-start gap-4">
                            <Clock className="h-5 w-5 mt-0.5 text-[hsl(var(--primary))] shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold mb-3">Графік роботи</h3>
                                <div className="space-y-2">
                                    {schedule.map((item) => (
                                        <div
                                            key={item.day}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span
                                                className={
                                                    item.closed
                                                        ? "text-[hsl(var(--muted-foreground))]"
                                                        : ""
                                                }
                                            >
                                                {item.day}
                                            </span>
                                            <span
                                                className={
                                                    item.closed
                                                        ? "text-[hsl(var(--destructive))]"
                                                        : "text-[hsl(var(--foreground))] font-medium"
                                                }
                                            >
                                                {item.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="border border-[hsl(var(--border))] overflow-hidden min-h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.0!2d26.275421!3d50.611074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472f13d22d4db4e1%3A0x8c8e5a4b1b3b0a0a!2z0LLRg9C7LiDQodGC0LXQv9Cw0L3QsCDQkdCw0L3QtNC10YDQuCwgNjDQkCwg0KDRltCy0L3QtQ!5e0!3m2!1suk!2sua!4v1700000000000"
                            className="w-full h-full min-h-[400px] border-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Brother Service на карті"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
