import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { validateName, validatePhone } from "@/lib/booking/validation";
import { sendBookingNotification } from "@/lib/telegram";
import { formatTimeKyiv, formatDateKyiv } from "@/lib/booking/slots";
import { addMinutes, format } from "date-fns";

interface BookingRequestBody {
    barber_service_id: string;
    barber_id: string;
    start_time: string;
    customer_name: string;
    customer_phone: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: BookingRequestBody = await request.json();

        if (!body.barber_service_id || !body.barber_id || !body.start_time || !body.customer_name || !body.customer_phone) {
            return NextResponse.json(
                { error: "Заповніть усі обов'язкові поля" },
                { status: 400 }
            );
        }

        if (!validateName(body.customer_name)) {
            return NextResponse.json(
                { error: "Невірне ім'я (мінімум 2 символи)" },
                { status: 400 }
            );
        }

        if (!validatePhone(body.customer_phone)) {
            return NextResponse.json(
                { error: "Невірний формат телефону (+380XXXXXXXXX)" },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        // ---- Get barber_service to know duration & name ----
        const { data: service, error: serviceError } = await supabase
            .from("barber_services")
            .select("*")
            .eq("id", body.barber_service_id)
            .single();

        if (serviceError || !service) {
            return NextResponse.json(
                { error: "Послугу не знайдено" },
                { status: 404 }
            );
        }

        // ---- Calculate end_time ----
        const startTime = new Date(body.start_time);
        const endTime = addMinutes(startTime, service.duration_minutes);
        const dateStr = format(startTime, "yyyy-MM-dd");

        // ---- Get current user (optional, for booking history) ----
        const userClient = await createClient();
        const { data: { user } } = await userClient.auth.getUser();

        // ---- Insert booking ----
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                customer_name: body.customer_name.trim(),
                customer_phone: body.customer_phone.replace(/\s/g, ""),
                barber_id: body.barber_id,
                barber_service_id: body.barber_service_id,
                service_id: null,
                user_id: user?.id ?? null,
                date: dateStr,
                start_time: body.start_time,
                end_time: endTime.toISOString(),
                status: "pending",
            })
            .select("*")
            .single();

        if (bookingError) {
            if (
                bookingError.code === "23P01" ||
                bookingError.message?.includes("no_overlapping_bookings")
            ) {
                return NextResponse.json(
                    { error: "Цей час вже зайнятий. Оберіть інший." },
                    { status: 409 }
                );
            }
            console.error("Booking insert error:", bookingError);
            return NextResponse.json(
                { error: "Помилка створення запису. Спробуйте ще раз." },
                { status: 500 }
            );
        }

        // ---- Get barber name for notification ----
        const { data: barber } = await supabase
            .from("barbers")
            .select("name")
            .eq("id", body.barber_id)
            .single();

        sendBookingNotification({
            customerName: body.customer_name.trim(),
            customerPhone: body.customer_phone,
            serviceName: service.name,
            barberName: barber?.name ?? "Невідомий",
            date: formatDateKyiv(body.start_time),
            time: formatTimeKyiv(body.start_time),
        });

        return NextResponse.json(
            { success: true, booking_id: booking.id },
            { status: 201 }
        );
    } catch (err) {
        console.error("Booking API error:", err);
        return NextResponse.json(
            { error: "Внутрішня помилка серверу" },
            { status: 500 }
        );
    }
}
