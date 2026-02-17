"use client";

import { useApp } from "@/contexts/AppContext";
import {
    ClipboardList,
    Bot,
    Wrench,
    FileSpreadsheet,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ArrowRightCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function HandoverPage() {
    const { history, adjustmentLogs, machines, maintenanceHistory, role } = useApp();
    const [manualObservation, setManualObservation] = useState("");
    const [isConcluding, setIsConcluding] = useState(false);

    // Filter data for the last 12 hours
    const last12HoursData = useMemo(() => {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        return {
            neoFeedback: history.filter(h =>
                h.category === "Feedback" && new Date(h.timestamp) > twelveHoursAgo
            ),
            technicalAdjustments: adjustmentLogs.filter(log =>
                new Date(log.startTime) > twelveHoursAgo || (log.endTime && new Date(log.endTime) > twelveHoursAgo)
            ),
            setups: history.filter(h =>
                h.description.toLowerCase().includes("op") &&
                h.description.toLowerCase().includes("finalizada") &&
                new Date(h.timestamp) > twelveHoursAgo
            ),
            maintenance: maintenanceHistory.filter(m =>
                new Date(m.timestamp) > twelveHoursAgo
            )
        };
    }, [history, adjustmentLogs, maintenanceHistory]);

    const handleConclude = () => {
        setIsConcluding(true);
        // In a real app, this would log the handover event to the database
        setTimeout(() => {
            alert("Troca de Turno concluída e registrada!");
            setIsConcluding(false);
            setManualObservation("");
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-24 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                        <ArrowRightCircle className="w-8 h-8 text-primary" />
                        Troca de Turno
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Relatório consolidado das últimas 12 horas de produção.
                    </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div className="text-xs font-bold uppercase tracking-widest text-primary/80">
                        Turno Atual: <span className="text-primary font-black">12h</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Assistente NEO Dashboard */}
                <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-4 bg-primary/5 border-b border-border flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <h2 className="font-black text-sm uppercase tracking-tighter">Ocorrências NEO Copilot</h2>
                    </div>
                    <div className="p-4 flex-1 space-y-3">
                        {last12HoursData.neoFeedback.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic p-4 text-center">Nenhuma ocorrência registrada pelo assistente.</p>
                        ) : (
                            last12HoursData.neoFeedback.map((h, i) => (
                                <div key={i} className="flex gap-3 p-3 bg-muted/20 rounded-xl border border-border/50">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold leading-tight">{h.description}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Máquina: {h.machineId} • {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 2. Log de Ajustes Técnicos & Notas Fixas */}
                <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-4 bg-orange-500/5 border-b border-border flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-orange-500" />
                        <h2 className="font-black text-sm uppercase tracking-tighter">Ajustes Técnicos (HD)</h2>
                    </div>
                    <div className="p-4 flex-1 space-y-4">
                        {/* Dynamic Logs */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-1">Logs do Turno</h3>
                            {last12HoursData.technicalAdjustments.length === 0 && (
                                <p className="text-[11px] text-muted-foreground italic py-2">Sem ajustes técnicos registrados.</p>
                            )}
                            {last12HoursData.technicalAdjustments.map((log, i) => (
                                <div key={i} className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold">Ajuste em {log.machineId} (OP {log.op})</p>
                                        {log.observation && <p className="text-[11px] text-muted-foreground italic">"{log.observation}"</p>}
                                    </div>
                                    <span className="text-[9px] font-black bg-orange-500/20 text-orange-600 px-2 py-0.5 rounded">
                                        {log.endTime ? "CONCLUÍDO" : "EM ANDAMENTO"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Particularities (Fixed Notes) with important info */}
                        <div className="space-y-2 pt-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-1">Particularidades Ativas</h3>
                            {machines.filter(m => m.particularities).map((m, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <AlertCircle className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <p className="text-[11px] leading-snug">
                                        <strong className="font-black uppercase">{m.id}:</strong> {m.particularities}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Relatório de Setups (OPs) */}
                <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm md:col-span-2">
                    <div className="p-4 bg-blue-500/5 border-b border-border flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                        <h2 className="font-black text-sm uppercase tracking-tighter">Movimentação de OPs (Setups)</h2>
                    </div>
                    <div className="p-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {last12HoursData.setups.length === 0 ? (
                                <div className="col-span-full py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Nenhuma movimentação de OP detectada no turno.</p>
                                </div>
                            ) : (
                                last12HoursData.setups.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <ArrowRightCircle className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black">{s.machineId}</p>
                                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">OP Finalizada</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* 4. Manual Observation & Conclusion */}
            <section className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg transform transition-all hover:shadow-xl">
                <div className="p-4 bg-primary text-primary-foreground flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <h2 className="font-black text-sm uppercase tracking-widest">Observações para o Próximo Turno</h2>
                </div>
                <div className="p-6 space-y-4">
                    <textarea
                        value={manualObservation}
                        onChange={(e) => setManualObservation(e.target.value)}
                        placeholder="Descreva aqui detalhes importantes, pendências técnicas ou alertas para o colega que entrará agora..."
                        className="w-full min-h-[150px] bg-muted/30 border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none font-medium"
                    />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Assinatura Digital: <span className="text-foreground">{role} - {new Date().toLocaleDateString()}</span>
                        </div>

                        <button
                            onClick={handleConclude}
                            disabled={isConcluding}
                            className={cn(
                                "group relative overflow-hidden px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100",
                                isConcluding ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {isConcluding ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 animate-bounce" />
                                        REGISTRANDO...
                                    </>
                                ) : (
                                    <>
                                        CONCLUIR TROCA DE TURNO
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

