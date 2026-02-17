"use client";

import { useApp, Machine } from "@/contexts/AppContext";
import { Save, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdjustmentsPage() {
    const { machines, updateMachineData, toggleAdjustment, items } = useApp();
    const [localMachines, setLocalMachines] = useState<Machine[]>(machines);
    const [savedId, setSavedId] = useState<string | null>(null);

    // Sync from context only if not currently editing (to avoid losing cursor/state if shared state updates)
    useEffect(() => {
        setLocalMachines(machines);
    }, [machines]);

    const handleInputChange = (id: string, field: keyof Machine, value: string | number) => {
        setLocalMachines(prev => prev.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    const handleSave = (id: string) => {
        const machine = localMachines.find(m => m.id === id);
        if (machine) {
            updateMachineData(id, machine);
            setSavedId(id);
            setTimeout(() => setSavedId(null), 2000);
        }
    };

    // Refined calculation logic
    const calculateEstimatedEnd = (machine: Machine) => {
        if (!machine.cycleTime || machine.cycleTime === "-" || !machine.totalTarget) return "---";

        try {
            // Parse cycle time "M:S" or "M:S,ms"
            const [minutesPart, secondsPart] = machine.cycleTime.split(":");
            const minutes = parseInt(minutesPart) || 0;
            const seconds = parseFloat(secondsPart?.replace(",", ".") || "0") || 0;
            const cycleInSeconds = (minutes * 60) + seconds;

            const remainingPieces = Math.max(0, machine.totalTarget - machine.pieces);
            if (remainingPieces === 0) return "Finalizado";

            const totalSecondsRestante = remainingPieces * cycleInSeconds;
            const now = new Date();
            const finishDate = new Date(now.getTime() + totalSecondsRestante * 1000);

            // Format [DD/MM] - [HH:MM]
            const day = String(finishDate.getDate()).padStart(2, '0');
            const month = String(finishDate.getMonth() + 1).padStart(2, '0');
            const hours = String(finishDate.getHours()).padStart(2, '0');
            const minutesReady = String(finishDate.getMinutes()).padStart(2, '0');

            return `${day}/${month} - ${hours}:${minutesReady}`;
        } catch (e) {
            return "Erro";
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Ajustes de Ordens de Produção</h1>
                <p className="text-sm text-muted-foreground">
                    Gerenciamento técnico: campos em cinza são para entrada, campos destacados são cálculos automáticos.
                </p>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
                        <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-widest">
                            <tr>
                                <th className="px-4 py-4 w-[100px]">Máquina</th>
                                <th className="px-4 py-4 w-[150px]">Número da OP</th>
                                <th className="px-4 py-4">Item / Produto</th>
                                <th className="px-4 py-4 w-[120px]">Produzido</th>
                                <th className="px-4 py-4 w-[120px]">Meta (Total)</th>
                                <th className="px-4 py-4 w-[120px]">Ciclo (M:S)</th>
                                <th className="px-4 py-4 w-[180px] text-primary">Término Est.</th>
                                <th className="px-4 py-4 w-[140px] text-center">Status Setup</th>
                                <th className="px-4 py-4 w-[120px] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {localMachines.map((m) => (
                                <tr key={m.id} className="hover:bg-accent/5 transition-colors">
                                    <td className="px-4 py-4 border-r border-border/30 bg-muted/10 font-mono font-bold text-sm">
                                        {m.id}
                                    </td>

                                    <td className="px-3 py-3">
                                        <input
                                            type="text"
                                            value={m.op}
                                            onChange={(e) => handleInputChange(m.id, "op", e.target.value)}
                                            className="w-full bg-muted/20 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                                            placeholder="Ex: 5010..."
                                        />
                                    </td>

                                    <td className="px-3 py-3">
                                        <input
                                            type="text"
                                            value={m.item}
                                            onChange={(e) => handleInputChange(m.id, "item", e.target.value)}
                                            list="items-list"
                                            className="w-full bg-muted/20 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                                            placeholder="Nome do produto"
                                        />
                                    </td>

                                    <td className="px-3 py-3">
                                        <input
                                            type="number"
                                            value={m.pieces}
                                            onChange={(e) => handleInputChange(m.id, "pieces", parseInt(e.target.value) || 0)}
                                            className="w-full bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/50 outline-none transition-all text-center font-bold"
                                        />
                                    </td>

                                    <td className="px-3 py-3">
                                        <input
                                            type="number"
                                            value={m.totalTarget || 0}
                                            onChange={(e) => handleInputChange(m.id, "totalTarget", parseInt(e.target.value) || 0)}
                                            className="w-full bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/50 outline-none transition-all text-center font-black"
                                        />
                                    </td>

                                    <td className="px-3 py-3">
                                        <input
                                            type="text"
                                            value={m.cycleTime}
                                            onChange={(e) => handleInputChange(m.id, "cycleTime", e.target.value)}
                                            className="w-full bg-muted/20 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/50 outline-none transition-all text-center font-mono"
                                            placeholder="0:00"
                                        />
                                    </td>

                                    <td className="px-4 py-3 bg-primary/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-primary/70 font-bold uppercase">Estimativa</span>
                                            <span className="text-sm font-black text-primary font-mono whitespace-nowrap">
                                                {calculateEstimatedEnd(m)}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                const isStarting = m.status !== "Adjustment";
                                                toggleAdjustment(m.id, isStarting);
                                            }}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all shadow-sm",
                                                m.status === "Adjustment"
                                                    ? "bg-green-500 text-white hover:bg-green-600"
                                                    : "bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            {m.status === "Adjustment" ? "Finalizar Setup" : "Iniciar Setup"}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <button
                                            onClick={() => handleSave(m.id)}
                                            className={cn(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-lg",
                                                savedId === m.id
                                                    ? "bg-green-500 text-white shadow-green-500/20"
                                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                                            )}
                                        >
                                            {savedId === m.id ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    SALVO
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    SALVAR
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4 pb-24">
                {localMachines.map((m) => (
                    <div key={m.id} className="bg-card border-2 border-border/50 rounded-2xl p-5 space-y-4 shadow-lg overflow-hidden relative">
                        {/* Machine Indicator */}
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-muted px-3 py-1 rounded-lg font-mono font-black text-lg text-primary">{m.id}</span>
                                {m.status === "Adjustment" && (
                                    <span className="flex h-3 w-3 rounded-full bg-red-600 animate-pulse" title="Em Setup" />
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-muted-foreground font-black uppercase block">Término Est.</span>
                                <span className="text-sm font-black text-primary font-mono">{calculateEstimatedEnd(m)}</span>
                            </div>
                        </div>

                        {/* Editable Fields Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Ordem de Prod.</label>
                                <input
                                    type="text"
                                    value={m.op}
                                    onChange={(e) => handleInputChange(m.id, "op", e.target.value)}
                                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Ex: 5010"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Ciclo (M:S)</label>
                                <input
                                    type="text"
                                    value={m.cycleTime}
                                    onChange={(e) => handleInputChange(m.id, "cycleTime", e.target.value)}
                                    className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-mono text-center focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="0:00"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Item / Produto</label>
                            <input
                                type="text"
                                value={m.item}
                                onChange={(e) => handleInputChange(m.id, "item", e.target.value)}
                                list="items-list"
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Nome do produto"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Produzido</label>
                                <input
                                    type="number"
                                    value={m.pieces}
                                    onChange={(e) => handleInputChange(m.id, "pieces", parseInt(e.target.value) || 0)}
                                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-4 text-center text-xl font-black text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Meta Total</label>
                                <input
                                    type="number"
                                    value={m.totalTarget || 0}
                                    onChange={(e) => handleInputChange(m.id, "totalTarget", parseInt(e.target.value) || 0)}
                                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-4 text-center text-xl font-black text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                        </div>

                        {/* Action Buttons Stacking on Mobile */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => {
                                    const isStarting = m.status !== "Adjustment";
                                    toggleAdjustment(m.id, isStarting);
                                }}
                                className={cn(
                                    "w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    m.status === "Adjustment"
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                                        : "bg-muted/50 border border-border text-muted-foreground"
                                )}
                            >
                                {m.status === "Adjustment" ? "Finalizar Setup" : "Iniciar Setup"}
                            </button>

                            <button
                                onClick={() => handleSave(m.id)}
                                className={cn(
                                    "w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
                                    savedId === m.id
                                        ? "bg-green-600 text-white"
                                        : "bg-primary text-white shadow-primary/30"
                                )}
                            >
                                {savedId === m.id ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {savedId === m.id ? "SALVO COM SUCESSO" : "SALVAR ALTERAÇÕES"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Guide Footnote */}
            <div className="flex items-center gap-6 mt-4 text-[11px] text-muted-foreground font-medium uppercase tracking-widest px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted/30 rounded border border-border/50" />
                    <span>Inputs Editáveis</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Clock className="w-3 h-3" />
                    <span>Resultados Calculados</span>
                </div>
            </div>

            <datalist id="items-list">
                {items.map(it => (
                    <option key={it.id} value={it.id}>{it.name}</option>
                ))}
            </datalist>
        </div>
    );
}

// Utility
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
