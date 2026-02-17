"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Network, Search, Database, ClipboardList, BarChart, PlusSquare, ArrowRightLeft, HardHat, FileText, LogOut, Wrench, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

export function Sidebar() {
    const pathname = usePathname();
    const { role, logout } = useApp();

    const isActive = (path: string) => pathname === path;

    // Hide sidebar on Home screen
    if (pathname === "/") return null;

    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
            <Link href="/" className="h-16 flex items-center px-6 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer group" title="Voltar para Home">
                <div className="flex items-center gap-2 font-bold text-xl text-primary group-hover:scale-105 transition-transform">
                    <Network className="w-6 h-6" />
                    <span>NEO</span>
                </div>
            </Link>

            <nav className="flex-1 overflow-y-auto py-4">

                {/* OPERATOR MENUS */}
                {role === "OPERATOR" && (
                    <>
                        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Operacional
                        </div>
                        <ul className="space-y-1 px-3 mb-6">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/dashboard") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <LayoutDashboard className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Painel NEO
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/operator"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator") && !isActive("/operator/help") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Network className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Grid de Máquinas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/maintenance"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/maintenance") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Wrench className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Manutenção
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/operator/help"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator/help") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <HardHat className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Chat de Ajuda
                                </Link>
                            </li>
                        </ul>
                    </>
                )}

                {/* PREPARER MENUS */}
                {role === "PREPARER" && (
                    <>
                        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Técnico
                        </div>
                        <ul className="space-y-1 px-3 mb-6">
                            <li>
                                <Link
                                    href="/operator/handover"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator/handover") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <ArrowRightLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Troca de Turno
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/operator"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator") && !isActive("/operator/handover") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <PlusSquare className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Ajustes de OP
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/operator"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator") && !isActive("/operator/handover") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Network className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Grid de Máquinas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/maintenance"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/maintenance") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Wrench className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Manutenção
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/dashboard") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <BarChart className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    OEE (Indicadores)
                                </Link>
                            </li>
                        </ul>
                    </>
                )}

                {/* ADMIN MENUS */}
                {role === "ADMIN" && (
                    <>
                        <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Gestão Total
                        </div>
                        <ul className="space-y-1 px-3">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/dashboard") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <LayoutDashboard className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Visão Geral
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/operator"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/operator") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Network className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Grid de Máquinas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/library"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/library") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Database className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Biblioteca de Itens
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/orders"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/orders") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <ClipboardList className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Ordens de Serviço
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/reports"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/reports") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <BarChart className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Relatórios
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/decision-tree"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/decision-tree") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Network className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Árvore de Decisão
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/access"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/access") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <ShieldAlert className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Gestão de Acessos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/system"
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive("/admin/system") ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    Configurações
                                </Link>
                            </li>
                        </ul>
                    </>
                )}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-border mt-auto">
                <button
                    onClick={logout}
                    className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-500 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>
        </aside >
    );
}
