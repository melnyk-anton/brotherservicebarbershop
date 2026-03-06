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

    if (error) return { error: error.message };
    if (!data.user) return { error: "Помилка реєстрації" };

    // Create profile
    await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
    });

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
