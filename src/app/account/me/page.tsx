import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LogoutButton } from "@/components/auth/logout-button";
import { User, Scissors, Phone, Mail, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Мій кабінет — Brother Service",
};

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Очікує", color: "bg-yellow-500/10 text-yellow-400 border-yellow-800" },
    confirmed: { label: "Підтверджено", color: "bg-green-500/10 text-green-400 border-green-800" },
    completed: { label: "Виконано", color: "bg-zinc-500/10 text-zinc-400 border-zinc-700" },
    cancelled: { label: "Скасовано", color: "bg-red-500/10 text-red-400 border-red-800" },
};

export default async function AccountPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/account/login");

    // Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Bookings
    const { data: bookings } = await supabase
        .from("bookings")
        .select("*, barber:barbers(name, title), barber_service:barber_services(name, price_uah)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    const displayName = profile?.full_name || user.email?.split("@")[0] || "Клієнт";

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-3xl px-6 space-y-8">

                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                                <User className="h-6 w-6 text-[hsl(187,71%,50%)]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                                    {displayName}
                                </h1>
                                <p className="text-sm text-zinc-400">{user.email}</p>
                            </div>
                        </div>
                        <LogoutButton />
                    </div>

                    {/* Info */}
                    <Card className="border-zinc-800 bg-zinc-900/40">
                        <CardContent className="p-5 grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-[hsl(187,71%,50%)]" />
                                <div>
                                    <p className="text-xs text-zinc-500">Email</p>
                                    <p className="text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                            {profile?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-[hsl(187,71%,50%)]" />
                                    <div>
                                        <p className="text-xs text-zinc-500">Телефон</p>
                                        <p className="text-sm font-medium">{profile.phone}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bookings */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Мої записи</h2>
                            <Button asChild size="sm">
                                <Link href="/book">Записатися</Link>
                            </Button>
                        </div>

                        {!bookings || bookings.length === 0 ? (
                            <Card className="border-zinc-800 bg-zinc-900/40">
                                <CardContent className="p-8 text-center">
                                    <Scissors className="h-8 w-8 mx-auto mb-3 text-zinc-600" />
                                    <p className="text-zinc-400">Записів ще немає</p>
                                    <Button asChild className="mt-4" size="sm">
                                        <Link href="/book">Записатися</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map((b: any) => {
                                    const st = statusLabels[b.status] ?? statusLabels.pending;
                                    return (
                                        <Card key={b.id} className="border-zinc-800 bg-zinc-900/40">
                                            <CardContent className="p-4 flex items-start justify-between gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Scissors className="h-4 w-4 text-[hsl(187,71%,50%)]" />
                                                        <span className="font-medium text-sm">
                                                            {b.barber_service?.name ?? "Послуга"}
                                                        </span>
                                                        {b.barber_service?.price_uah && (
                                                            <span className="text-xs text-zinc-400">
                                                                {b.barber_service.price_uah} ₴
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                        <User className="h-3.5 w-3.5" />
                                                        {b.barber?.name} · {b.barber?.title}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {b.date} о {b.start_time?.slice(11, 16)}
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
