"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
    { href: "/#services", label: "Послуги" },
    { href: "/masters", label: "Майстри" },
    { href: "/#location", label: "Контакти" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-[hsl(var(--background))]/95 backdrop-blur-md border-b border-[hsl(var(--border))]"
                    : "bg-transparent"
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link href="/" className="flex items-center gap-0">
                    <span className="text-lg font-bold tracking-tight uppercase">
                        Brother<span className="text-[hsl(var(--primary))]">Service</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Button asChild size="sm">
                        <Link href="/book">Записатися</Link>
                    </Button>
                    {user ? (
                        <Link
                            href="/account/me"
                            className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                        >
                            <User className="h-4 w-4" />
                            Кабінет
                        </Link>
                    ) : (
                        <Link
                            href="/account/login"
                            className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                        >
                            Увійти
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label={isMobileOpen ? "Закрити меню" : "Відкрити меню"}
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="md:hidden bg-[hsl(var(--background))]/98 backdrop-blur-md border-b border-[hsl(var(--border))]">
                    <div className="flex flex-col items-center gap-4 py-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button asChild size="sm">
                            <Link href="/book" onClick={() => setIsMobileOpen(false)}>
                                Записатися
                            </Link>
                        </Button>
                        {user ? (
                            <Link
                                href="/account/me"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--primary))]"
                            >
                                <User className="h-4 w-4" />
                                Мій кабінет
                            </Link>
                        ) : (
                            <Link
                                href="/account/login"
                                onClick={() => setIsMobileOpen(false)}
                                className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                                Увійти
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
