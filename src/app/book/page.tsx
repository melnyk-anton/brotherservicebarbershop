import { createClient } from "@/lib/supabase/server";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
    title: "Записатися — Brother Service",
    description: "Онлайн запис у барбершоп Brother Service, Рівне",
};

export default async function BookingPage() {
    const supabase = await createClient();

    const [servicesRes, barbersRes] = await Promise.all([
        supabase
            .from("services")
            .select("*")
            .eq("active", true)
            .order("sort_order"),
        supabase
            .from("barbers")
            .select("*")
            .eq("active", true)
            .order("sort_order"),
    ]);

    const services = servicesRes.data ?? [];

    // Deduplicate barbers by name+title in case DB has duplicate entries
    const seen = new Set<string>();
    const barbers = (barbersRes.data ?? []).filter((b) => {
        const key = `${b.name}__${b.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-3xl px-6">
                    <BookingWizard services={services} barbers={barbers} />
                </div>
            </main>
            <Footer />
        </>
    );
}
