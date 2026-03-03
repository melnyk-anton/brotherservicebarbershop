import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { ServicesSection } from "@/components/landing/services-section";
import { TeamSection } from "@/components/landing/team-section";
import { LocationSection } from "@/components/landing/location-section";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <ServicesSection />
                <TeamSection />
                <LocationSection />
            </main>
            <Footer />
        </>
    );
}
