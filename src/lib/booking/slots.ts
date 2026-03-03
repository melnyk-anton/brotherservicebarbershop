import {
    addMinutes,
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    isBefore,
    isAfter,
    areIntervalsOverlapping,
    format,
    startOfDay,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import type { TimeSlot } from "./types";

const KYIV_TZ = "Europe/Kyiv";
const OPEN_HOUR = 9;
const CLOSE_HOUR = 21;
const SLOT_INTERVAL_MINUTES = 30;

interface ExistingBooking {
    start_time: string;
    end_time: string;
    barber_id: string;
}

/**
 * Generates available time slots for a given date, barber, and service duration.
 *
 * - All internal calculations use Kyiv time for business logic
 * - Returns UTC ISO strings for database storage
 * - Filters out slots that overlap with existing bookings
 * - Filters out slots where service would end after closing time
 * - Filters out past slots (for today)
 */
export function generateTimeSlots(
    date: Date,
    durationMinutes: number,
    existingBookings: ExistingBooking[],
    selectedBarberId: string | null // null = any barber mode
): TimeSlot[] {
    const slots: TimeSlot[] = [];

    // Get the start of the selected date in Kyiv time
    const dateInKyiv = toZonedTime(date, KYIV_TZ);
    const dayStart = startOfDay(dateInKyiv);

    // Current time in Kyiv for filtering past slots
    const nowInKyiv = toZonedTime(new Date(), KYIV_TZ);

    // Generate slots from OPEN_HOUR to CLOSE_HOUR at SLOT_INTERVAL intervals
    let currentSlotKyiv = setMilliseconds(
        setSeconds(setMinutes(setHours(dayStart, OPEN_HOUR), 0), 0),
        0
    );
    const closingTimeKyiv = setMilliseconds(
        setSeconds(setMinutes(setHours(dayStart, CLOSE_HOUR), 0), 0),
        0
    );

    while (isBefore(currentSlotKyiv, closingTimeKyiv)) {
        const slotEndKyiv = addMinutes(currentSlotKyiv, durationMinutes);

        // Slot must not extend past closing time
        if (isAfter(slotEndKyiv, closingTimeKyiv)) {
            currentSlotKyiv = addMinutes(currentSlotKyiv, SLOT_INTERVAL_MINUTES);
            continue;
        }

        // Convert to UTC for storage
        const slotStartUtc = fromZonedTime(currentSlotKyiv, KYIV_TZ);
        const slotEndUtc = fromZonedTime(slotEndKyiv, KYIV_TZ);

        // Check if slot is in the past
        const isPast = isBefore(currentSlotKyiv, nowInKyiv);

        // Check for conflicts with existing bookings
        const hasConflict = existingBookings.some((booking) => {
            // If we're looking for a specific barber, only check that barber's bookings
            if (selectedBarberId && booking.barber_id !== selectedBarberId) {
                return false;
            }

            const bookingStart = new Date(booking.start_time);
            const bookingEnd = new Date(booking.end_time);

            return areIntervalsOverlapping(
                { start: slotStartUtc, end: slotEndUtc },
                { start: bookingStart, end: bookingEnd }
            );
        });

        const displayTime = format(currentSlotKyiv, "HH:mm");

        slots.push({
            display: displayTime,
            startUtc: slotStartUtc.toISOString(),
            endUtc: slotEndUtc.toISOString(),
            available: !isPast && !hasConflict,
        });

        currentSlotKyiv = addMinutes(currentSlotKyiv, SLOT_INTERVAL_MINUTES);
    }

    return slots;
}

/**
 * For "any barber" mode: find which barbers are available for a given slot.
 */
export function findAvailableBarbersForSlot(
    slotStartUtc: string,
    slotEndUtc: string,
    existingBookings: ExistingBooking[],
    allBarberIds: string[]
): string[] {
    const slotStart = new Date(slotStartUtc);
    const slotEnd = new Date(slotEndUtc);

    return allBarberIds.filter((barberId) => {
        const barberBookings = existingBookings.filter(
            (b) => b.barber_id === barberId
        );
        return !barberBookings.some((booking) =>
            areIntervalsOverlapping(
                { start: slotStart, end: slotEnd },
                { start: new Date(booking.start_time), end: new Date(booking.end_time) }
            )
        );
    });
}

/**
 * Format a UTC ISO string to Kyiv display time.
 */
export function formatTimeKyiv(utcIso: string): string {
    const kyivTime = toZonedTime(new Date(utcIso), KYIV_TZ);
    return format(kyivTime, "HH:mm");
}

/**
 * Format a UTC ISO string to Kyiv display date.
 */
export function formatDateKyiv(utcIso: string | Date): string {
    const date = typeof utcIso === "string" ? new Date(utcIso) : utcIso;
    const kyivTime = toZonedTime(date, KYIV_TZ);
    return format(kyivTime, "dd.MM.yyyy");
}
