"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function registerAction(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        if (error.message.includes("rate limit")) {
            return { error: "Занадто багато спроб. Зачекайте кілька хвилин." };
        }
        return { error: error.message };
    }

    if (!data.user) return { error: "Помилка реєстрації. Спробуйте ще раз." };

    // Save profile
    await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
    });

    // If email confirmation is required — show message instead of redirect
    if (!data.session) {
        return { success: "Перевірте пошту та підтвердіть email, потім увійдіть." };
    }

    revalidatePath("/account/me");
    redirect("/account/me");
}

export async function loginAction(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: "Невірний email або пароль" };

    revalidatePath("/account/me");
    redirect("/account/me");
}

export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/");
}
