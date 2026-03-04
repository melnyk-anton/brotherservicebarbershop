import type { Barber, BarberService } from "@/lib/supabase/types";

export interface BookingState {
    step: number;
    barber: Barber | null;
    service: BarberService | null;
    date: Date | null;
    timeSlot: string | null;
    customerName: string;
    customerPhone: string;
}

export interface TimeSlot {
    /** Display time in Europe/Kyiv, e.g. "09:00" */
    display: string;
    /** UTC ISO string for start_time */
    startUtc: string;
    /** UTC ISO string for end_time */
    endUtc: string;
    /** Whether this slot is available */
    available: boolean;
}

export type BookingAction =
    | { type: "SET_BARBER"; payload: Barber }
    | { type: "SET_SERVICE"; payload: BarberService }
    | { type: "SET_DATE"; payload: Date }
    | { type: "SET_TIME_SLOT"; payload: string }
    | { type: "SET_CUSTOMER_NAME"; payload: string }
    | { type: "SET_CUSTOMER_PHONE"; payload: string }
    | { type: "GO_TO_STEP"; payload: number }
    | { type: "RESET" };

export const initialBookingState: BookingState = {
    step: 1,
    barber: null,
    service: null,
    date: null,
    timeSlot: null,
    customerName: "",
    customerPhone: "",
};

export function bookingReducer(
    state: BookingState,
    action: BookingAction
): BookingState {
    switch (action.type) {
        case "SET_BARBER":
            return {
                ...state,
                barber: action.payload,
                // Reset downstream selections when barber changes
                service: null,
                date: null,
                timeSlot: null,
                step: 2,
            };
        case "SET_SERVICE":
            return {
                ...state,
                service: action.payload,
                // Reset downstream
                date: null,
                timeSlot: null,
                step: 3,
            };
        case "SET_DATE":
            return {
                ...state,
                date: action.payload,
                timeSlot: null, // Reset time when date changes
            };
        case "SET_TIME_SLOT":
            return {
                ...state,
                timeSlot: action.payload,
                step: 4,
            };
        case "SET_CUSTOMER_NAME":
            return { ...state, customerName: action.payload };
        case "SET_CUSTOMER_PHONE":
            return { ...state, customerPhone: action.payload };
        case "GO_TO_STEP":
            return { ...state, step: action.payload };
        case "RESET":
            return initialBookingState;
        default:
            return state;
    }
}
