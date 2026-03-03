// ============================================
// Database types for Brother Service
// ============================================

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type AdminRole = "admin" | "superadmin";

export interface Barber {
    id: string;
    name: string;
    title: string;
    bio: string;
    image_url: string;
    portfolio_urls?: string[];
    active: boolean;
    sort_order: number;
    created_at: string;
}

export interface Service {
    id: string;
    name: string;
    category: string;
    duration_minutes: number;
    price_uah: number;
    active: boolean;
    sort_order: number;
    created_at: string;
}

export interface Booking {
    id: string;
    customer_name: string;
    customer_phone: string;
    barber_id: string;
    service_id: string;
    date: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    created_at: string;
}

export interface BookingWithDetails extends Booking {
    barber: Barber;
    service: Service;
}

export interface AdminUser {
    id: string;
    email: string;
    role: AdminRole;
    created_at: string;
}
