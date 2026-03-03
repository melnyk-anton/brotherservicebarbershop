import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateName, validatePhone } from "@/lib/booking/validation";
import { sendBookingNotification } from "@/lib/telegram";
import { formatTimeKyiv, formatDateKyiv, findAvailableBarbersForSlot } from "@/lib/booking/slots";
import { addMinutes, format } from "date-fns";

interface BookingRequestBody {
    service_id: string;
    barber_id: string | null;
    any_barber: boolean;
    start_time: string;
    customer_name: string;
    customer_phone: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: BookingRequestBody = await request.json();

        // ---- Validation ----
        if (!body.service_id || !body.start_time || !body.customer_name || !body.customer_phone) {
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

        // ---- Get service to know duration ----
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("id", body.service_id)
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

        // ---- Resolve barber ----
        let barberId = body.barber_id;

        if (body.any_barber || !barberId) {
            // Find an available barber
            const { data: activeBarbers } = await supabase
                .from("barbers")
                .select("id")
                .eq("active", true);

            const barberIds = (activeBarbers ?? []).map((b) => b.id);

            // Fetch existing bookings for the date
            const { data: existingBookings } = await supabase
                .from("bookings")
                .select("start_time, end_time, barber_id")
                .eq("date", dateStr)
                .neq("status", "cancelled");

            const availableBarbers = findAvailableBarbersForSlot(
                body.start_time,
                endTime.toISOString(),
                existingBookings ?? [],
                barberIds
            );

            if (availableBarbers.length === 0) {
                return NextResponse.json(
                    { error: "На цей час немає вільних майстрів" },
                    { status: 409 }
                );
            }

            // Auto-assign the first available barber
            barberId = availableBarbers[0];
        }

        // ---- Insert booking ----
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                customer_name: body.customer_name.trim(),
                customer_phone: body.customer_phone.replace(/\s/g, ""),
                barber_id: barberId,
                service_id: body.service_id,
                date: dateStr,
                start_time: body.start_time,
                end_time: endTime.toISOString(),
                status: "pending",
            })
            .select("*")
            .single();

        if (bookingError) {
            // Check for exclusion constraint violation (double booking)
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
            .eq("id", barberId)
            .single();

        // ---- Fire-and-forget Telegram notification ----
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
