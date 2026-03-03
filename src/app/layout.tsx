import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin", "cyrillic"],
    variable: "--font-playfair",
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Brother Service — Барбершоп у Рівному",
    description:
        "Сучасний чоловічий барбершоп Brother Service у Рівному. Стрижки, борода, масаж. Запишись онлайн!",
    keywords: ["барбершоп", "Рівне", "стрижка", "борода", "Brother Service"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk" className="dark overflow-x-hidden" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased overflow-x-hidden`}>
                {children}
            </body>
        </html>
    );
}
