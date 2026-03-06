"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/app/account/actions";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:border-red-800 hover:text-red-400 hover:bg-red-950/20"
            onClick={() => startTransition(() => logoutAction())}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Вийти
                </>
            )}
        </Button>
    );
}
