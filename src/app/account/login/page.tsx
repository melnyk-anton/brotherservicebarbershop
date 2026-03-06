import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
    title: "Увійти — Brother Service",
};

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">
                            Вхід
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Немає акаунту?{" "}
                            <Link href="/account/register" className="text-[hsl(187,71%,50%)] hover:underline">
                                Зареєструватися
                            </Link>
                        </p>
                    </div>
                    <AuthForm mode="login" />
                </div>
            </main>
            <Footer />
        </>
    );
}
