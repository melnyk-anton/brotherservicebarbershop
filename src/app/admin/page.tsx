"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    LogOut,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Users,
    CalendarDays,
    Scissors,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { uk } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import type { BookingWithDetails, Barber, BookingStatus } from "@/lib/supabase/types";

const KYIV_TZ = "Europe/Kyiv";

const statusLabels: Record<BookingStatus, string> = {
    pending: "Очікує",
    confirmed: "Підтверджено",
    completed: "Завершено",
    cancelled: "Скасовано",
};

const statusColors: Record<BookingStatus, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminDashboard() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = toZonedTime(new Date(), KYIV_TZ);
        return format(now, "yyyy-MM-dd");
    });
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"bookings" | "barbers">("bookings");

    const supabase = createClient();

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("bookings")
            .select("*, barber:barbers(*), service:services(*)")
            .eq("date", selectedDate)
            .order("start_time");

        if (!error && data) {
            setBookings(data as unknown as BookingWithDetails[]);
        }
        setLoading(false);
    }, [selectedDate]);

    const fetchBarbers = useCallback(async () => {
        const { data } = await supabase
            .from("barbers")
            .select("*")
            .order("sort_order");

        if (data) setBarbers(data);
    }, []);

    useEffect(() => {
        fetchBookings();
        fetchBarbers();
    }, [fetchBookings, fetchBarbers]);

    const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
        const { error } = await supabase
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", bookingId);

        if (!error) {
            setBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
            );
        }
    };

    const handleToggleBarber = async (barberId: string, active: boolean) => {
        const { error } = await supabase
            .from("barbers")
            .update({ active: !active })
            .eq("id", barberId);

        if (!error) {
            setBarbers((prev) =>
                prev.map((b) => (b.id === barberId ? { ...b, active: !active } : b))
            );
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    const goToDate = (offset: number) => {
        const current = new Date(selectedDate);
        const newDate = offset > 0 ? addDays(current, offset) : subDays(current, Math.abs(offset));
        setSelectedDate(format(newDate, "yyyy-MM-dd"));
    };

    const formatSlotTime = (utcIso: string) => {
        const kyiv = toZonedTime(new Date(utcIso), KYIV_TZ);
        return format(kyiv, "HH:mm");
    };

    const displayDate = format(new Date(selectedDate), "d MMMM yyyy, EEEE", {
        locale: uk,
    });

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Header */}
            <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-[hsl(var(--primary))]" />
                        <span className="font-bold">
                            BROTHER<span className="text-[hsl(var(--primary))]">.</span>ADMIN
                        </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                        <LogOut className="h-4 w-4" />
                        Вийти
                    </Button>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={tab === "bookings" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTab("bookings")}
                        className="gap-1"
                    >
                        <CalendarDays className="h-4 w-4" />
                        Записи
                    </Button>
                    <Button
                        variant={tab === "barbers" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTab("barbers")}
                        className="gap-1"
                    >
                        <Users className="h-4 w-4" />
                        Майстри
                    </Button>
                </div>

                {tab === "bookings" && (
                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Записи на день</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => goToDate(-1)}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium min-w-[200px] text-center">
                                        {displayDate}
                                    </span>
                                    <Button variant="outline" size="icon" onClick={() => goToDate(1)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
                                </div>
                            ) : bookings.length === 0 ? (
                                <p className="text-center py-12 text-[hsl(var(--muted-foreground))]">
                                    Записів на цей день немає
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Час</TableHead>
                                            <TableHead>Клієнт</TableHead>
                                            <TableHead>Телефон</TableHead>
                                            <TableHead>Послуга</TableHead>
                                            <TableHead>Майстер</TableHead>
                                            <TableHead>Статус</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {formatSlotTime(booking.start_time)} –{" "}
                                                    {formatSlotTime(booking.end_time)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {booking.customer_name}
                                                </TableCell>
                                                <TableCell className="text-sm text-[hsl(var(--muted-foreground))]">
                                                    {booking.customer_phone}
                                                </TableCell>
                                                <TableCell>{booking.service?.name}</TableCell>
                                                <TableCell>{booking.barber?.name}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={booking.status}
                                                        onValueChange={(val) =>
                                                            handleStatusChange(booking.id, val as BookingStatus)
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[140px] h-8">
                                                            <SelectValue>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={statusColors[booking.status]}
                                                                >
                                                                    {statusLabels[booking.status]}
                                                                </Badge>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(
                                                                Object.entries(statusLabels) as [BookingStatus, string][]
                                                            ).map(([value, label]) => (
                                                                <SelectItem key={value} value={value}>
                                                                    {label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                )}

                {tab === "barbers" && (
                    <Card className="border-[hsl(var(--border))]">
                        <CardHeader>
                            <CardTitle className="text-lg">Управління майстрами</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ім&apos;я</TableHead>
                                        <TableHead>Посада</TableHead>
                                        <TableHead>Статус</TableHead>
                                        <TableHead className="text-right">Дія</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {barbers.map((barber) => (
                                        <TableRow key={barber.id}>
                                            <TableCell className="font-medium">{barber.name}</TableCell>
                                            <TableCell className="text-[hsl(var(--muted-foreground))]">
                                                {barber.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        barber.active
                                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                                    }
                                                >
                                                    {barber.active ? "Активний" : "Неактивний"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleBarber(barber.id, barber.active)}
                                                >
                                                    {barber.active ? "Деактивувати" : "Активувати"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
