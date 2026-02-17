"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusSquare, ArrowRightLeft, Settings, Database, HardHat, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

export function BottomNav() {
    const pathname = usePathname();
    const { role } = useApp();

    const isActive = (path: string) => pathname === path;

    // Don't show bottom nav on root (Profile Selector)
    if (pathname === "/") return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
            <div className="flex justify-around items-center h-16">

                {/* COMMON: PAINEL */}
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                        isActive("/dashboard") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Painel</span>
                </Link>

                {/* REMOVED: NOVA ATIVIDADE requested by user */}

                {/* OPERATOR/PREPARER: TROCA DE TURNO */}
                {(role === "OPERATOR" || role === "PREPARER") && (
                    <Link
                        href="/operator/handover"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            isActive("/operator/handover") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <ArrowRightLeft className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Turno</span>
                    </Link>
                )}

                {/* PREPARER SPECIFIC */}
                {role === "PREPARER" && (
                    <Link
                        href="/preparer"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            isActive("/preparer") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <HardHat className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Ajustes</span>
                    </Link>
                )}

                {/* ADMIN: LIBRARY */}
                {role === "ADMIN" && (
                    <Link
                        href="/admin/library"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            isActive("/admin/library") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Database className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Biblioteca</span>
                    </Link>
                )}

                {/* ALL: SETTINGS/HELP */}
                <Link
                    href={role === "ADMIN" ? "/admin/system" : "/operator/help"}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                        isActive("/admin/system") || isActive("/operator/help") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">
                        {role === "ADMIN" ? "Sistema" : "Ajuda"}
                    </span>
                </Link>

                <Link
                    href="/"
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors text-muted-foreground hover:text-red-500"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Sair</span>
                </Link>

            </div>
        </nav >
    );
}
