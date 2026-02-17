"use client";

import { useApp } from "@/contexts/AppContext";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingUserControls() {
    const { role } = useApp();
    const pathname = usePathname();

    if (pathname === "/") return null;

    return (
        <div className="fixed bottom-6 right-6 flex items-center gap-4 bg-card border border-border p-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    CA
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-foreground">Carlos Alberto</p>
                    <p className="text-[10px] text-muted-foreground uppercase leading-none">
                        {role === "OPERATOR" && "Operador Nível II"}
                        {role === "PREPARER" && "Preparador Técnico"}
                        {role === "ADMIN" && "Administrador"}
                    </p>
                </div>
            </div>

            <div className="h-8 w-px bg-border mx-1" />

            <Link
                href="/"
                className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-full transition-colors"
                title="Sair / Trocar Perfil"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">SAIR</span>
            </Link>
        </div>
    );
}
