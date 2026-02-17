"use client";

import { useApp } from "@/contexts/AppContext";
import { BarChart3, TrendingUp, Settings, Activity, Wrench } from "lucide-react";

export default function DashboardPage() {
    const { machines } = useApp();

    const running = machines.filter(m => m.status === 'Running').length;
    const stopped = machines.filter(m => m.status === 'Stopped').length;
    const maintenance = machines.filter(m => m.status === 'Maintenance').length;

    // Calculate real-time adjustment duration
    // In a real app, we would sum the duration of closed logs + (now - start) of open logs
    // For this prototype, we'll mock a base value + active adjustments
    const totalAdjustmentMinutes = 45 + (machines.filter(m => m.status === 'Adjustment').length * 12);

    // Mock Data for Charts
    const weeklyAdjustments = [12, 19, 3, 5, 2, 3, 10]; // Mon-Sun
    const monthlySetups = [5, 8, 4, 6]; // Weeks 1-4

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                <p className="text-muted-foreground">Monitoramento de performance e indicadores de fábrica.</p>
            </div>

            {/* KPI Cards */}
            {/* OEE METRICS BLOCK */}
            <div className="p-6 bg-primary/10 border-2 border-primary/20 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Activity className="w-16 h-16 text-primary" />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Global OEE</p>
                    <h3 className="text-4xl font-black text-primary tracking-tighter">
                        {(() => {
                            const totalPieces = machines.reduce((acc, m) => acc + (m.pieces || 0), 0);
                            const totalTarget = machines.reduce((acc, m) => acc + (m.totalTarget || 1), 0);
                            const perf = totalTarget > 0 ? (totalPieces / totalTarget) : 0;
                            const avail = 0.95; // Mocked for now (Disponibilidade)
                            const qual = 0.98; // Mocked for now (Qualidade)
                            const oee = (avail * perf * qual) * 100;
                            return `${Math.min(100, Math.round(oee))}%`;
                        })()}
                    </h3>
                    <div className="mt-2 flex gap-2">
                        <span className="text-[9px] font-bold bg-green-500/20 text-green-600 px-2 py-0.5 rounded">A: 95%</span>
                        <span className="text-[9px] font-bold bg-blue-500/20 text-blue-600 px-2 py-0.5 rounded">P: {(() => {
                            const totalPieces = machines.reduce((acc, m) => acc + (m.pieces || 0), 0);
                            const totalTarget = machines.reduce((acc, m) => acc + (m.totalTarget || 1), 0);
                            return Math.round((totalPieces / totalTarget) * 100);
                        })()}%</span>
                        <span className="text-[9px] font-bold bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded">Q: 98%</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                            <Activity className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MÁQUINAS ATIVAS</p>
                            <h3 className="text-2xl font-black">{running} / {machines.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                            <Wrench className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MANUTENÇÃO</p>
                            <h3 className="text-2xl font-bold">{maintenance}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                            <Settings className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">SETUPS (MÊS)</p>
                            <h3 className="text-2xl font-bold">{weeklyAdjustments.reduce((a, b) => a + b, 0)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adjustment Metric (Preparer View) */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-full text-white shrink-0">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-amber-500 leading-tight">TEMPO TOTAL EM AJUSTE (TURNO)</h3>
                        <p className="text-muted-foreground text-xs font-medium mt-1">Soma de todas as máquinas em modo setup.</p>
                    </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 border-amber-500/10 pt-4 sm:pt-0">
                    <div className="text-4xl font-black text-amber-500 tracking-tighter">
                        {Math.floor(totalAdjustmentMinutes / 60)}h {totalAdjustmentMinutes % 60}m
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">

                {/* Weekly Adjustments Chart */}
                <div className="p-6 bg-card border border-border rounded-xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Ajustes Realizados (Semana)
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {weeklyAdjustments.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm relative group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                    style={{ height: `${val * 5}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground uppercase">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Setups Chart */}
                <div className="p-6 bg-card border border-border rounded-xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Setups por Semana (Mês Atual)
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {monthlySetups.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                <div
                                    className="w-full bg-blue-500/20 hover:bg-blue-500 transition-all rounded-t-sm relative"
                                    style={{ height: `${val * 10}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">Semana {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
