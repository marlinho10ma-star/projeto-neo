"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Play, Square, AlertTriangle, Settings, Activity, Clock, Save, Bot, Wrench, ClipboardList, FileText } from "lucide-react";
import { NeoChat } from "@/components/NeoChat";
import { cn } from "@/lib/utils";

export default function MachineDetailsPage({ params }: { params: any }) {
    const { machines, history, addHistoryEntry, role, updateMachineData, toggleAdjustment } = useApp();
    const unwrappedParams = use(params) as { id: string };
    const paramId = unwrappedParams?.id ? decodeURIComponent(unwrappedParams.id) : "undefined";

    // Robust detection: handles "TNL 028" vs "TNL-028" etc.
    const machine = machines.find((m) =>
        m.id === paramId ||
        m.id.replace(/\s+/g, '-') === paramId.replace(/\s+/g, '-') ||
        m.id.replace(/-/g, ' ') === paramId.replace(/-/g, ' ') ||
        m.id.toLowerCase().replace(/\s+/g, '') === paramId.toLowerCase().replace(/\s+/g, '')
    );

    // Local state for Preparer editing
    const [editForm, setEditForm] = useState({
        op: "",
        item: "",
        cycleTime: "",
        pieces: 0,
        totalTarget: 0
    });

    // Initialize form when machine data is loaded
    useEffect(() => {
        if (machine) {
            setEditForm({
                op: machine.op,
                item: machine.item,
                cycleTime: machine.cycleTime,
                pieces: machine.pieces || 0,
                totalTarget: machine.totalTarget || 0
            });
        }
    }, [machine]);

    const router = useRouter();
    const [observation, setObservation] = useState("");
    const [showNeo, setShowNeo] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial Loading Simulation
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-in fade-in">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <h2 className="text-xl font-bold">Carregando dados...</h2>
            </div>
        );
    }

    if (!machine) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-card border border-border rounded-2xl shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full mx-auto flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Máquina não encontrada</h2>
                    <p className="text-muted-foreground">
                        Não conseguimos localizar a máquina <span className="font-mono text-primary font-bold">"{paramId}"</span>.
                    </p>
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        Debug: ID capturado = {String(paramId)}
                    </p>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        VOLTAR PARA O INÍCIO
                    </button>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        Dica: Verifique se o código da máquina está correto na URL.
                    </p>
                </div>
            </div>
        );
    }

    // Special View for TNL 032 (Maintenance)
    if (machine.id === "TNL 032") {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-500/10 text-yellow-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold">Máquina em Manutenção Preventiva</h1>
                <p className="text-xl text-muted-foreground">
                    A TNL 032 está passando por uma revisão programada.
                    Por favor, verifique o quadro de avisos ou contate o supervisor.
                </p>
                <div className="p-4 bg-card border border-border rounded-lg inline-block text-left">
                    <h3 className="font-bold mb-2">Previsão de Retorno:</h3>
                    <p>Hoje, às 14:00</p>
                </div>
                <div>
                    <button onClick={() => router.back()} className="text-primary hover:underline font-bold mt-8">
                        Voltar para Lista
                    </button>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        updateMachineData(machine.id, editForm);
        alert("Dados atualizados com sucesso!");
        router.back();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Voltar</span>
                </button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{machine.id}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className={`w-2.5 h-2.5 rounded-full ${machine.status === 'Running' ? 'bg-green-500' :
                            machine.status === 'Stopped' ? 'bg-red-500' :
                                machine.status === 'Adjustment' ? 'bg-amber-500 animate-pulse' : 'bg-yellow-500'
                            }`} />
                        {machine.status === 'Adjustment' ? 'EM SETUP' : machine.status} • OP: {machine.op}
                    </div>
                </div>

                {(role === "PREPARER" || role === "ADMIN") && (
                    <div className="ml-auto">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white hover:bg-green-700 px-6 py-2.5 rounded-md font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all"
                        >
                            <Save className="w-4 h-4" />
                            SALVAR ALTERAÇÕES
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Data & Edit Form */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Dados de Produção
                        </h3>

                        {role === "OPERATOR" ? (
                            // OPERATOR VIEW (Read-only + Adjustment)
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background/50 p-4 rounded-lg">
                                        <div className="text-xs text-muted-foreground uppercase">Peças Prod.</div>
                                        <div className="text-2xl font-bold text-foreground flex items-end gap-2">
                                            {machine.pieces ?? 0}
                                            <span className="text-sm text-muted-foreground font-normal mb-1">
                                                / {machine.totalTarget ?? "0"}
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        {machine.totalTarget && (
                                            <div className="w-full h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${Math.min(((machine.pieces || 0) / machine.totalTarget) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-background/50 p-4 rounded-lg">
                                        <div className="text-xs text-muted-foreground uppercase">Ciclo</div>
                                        <div className="text-2xl font-bold text-foreground">{machine.cycleTime}</div>
                                        {/* Forecast Calculation */}
                                        {machine.cycleTime && machine.totalTarget && machine.pieces !== undefined && (
                                            <div className="text-[10px] text-muted-foreground mt-1 text-right leading-tight">
                                                Previsão: <br />
                                                <span className="font-bold text-primary">
                                                    {(() => {
                                                        try {
                                                            if (!machine.cycleTime || machine.cycleTime === "-") return "-";
                                                            const parts = String(machine.cycleTime).replace(',', '.').split(':');
                                                            let cycleSeconds = 0;
                                                            if (parts.length === 2) {
                                                                cycleSeconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
                                                            } else {
                                                                cycleSeconds = parseFloat(parts[0]);
                                                            }

                                                            if (isNaN(cycleSeconds) || cycleSeconds <= 0) return "-";

                                                            const total = machine.totalTarget ?? 0;
                                                            const current = machine.pieces ?? 0;
                                                            const remaining = Math.max(0, total - current);

                                                            if (remaining === 0) return "CONCLUÍDO";

                                                            const remainingSeconds = remaining * cycleSeconds;
                                                            const now = new Date();
                                                            const finishTime = new Date(now.getTime() + remainingSeconds * 1000);

                                                            const isToday = finishTime.getDate() === now.getDate();
                                                            const timeStr = finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                            return isToday ? `Hoje às ${timeStr}` : `Amanhã às ${timeStr}`;
                                                        } catch (e) {
                                                            console.error("Forecast Error:", e);
                                                            return "-";
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-background/50 p-4 rounded-lg col-span-2">
                                        <div className="text-xs text-muted-foreground uppercase">Item / Produto</div>
                                        <div className="text-xl font-medium text-foreground">{machine.item}</div>
                                    </div>
                                </div>

                                {/* Adjustment Toggle */}
                                <div className={`border rounded-lg p-4 flex items-center justify-between transition-colors ${machine.status === "Adjustment"
                                    ? "bg-amber-500/10 border-amber-500/50"
                                    : "bg-background border-border"
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${machine.status === "Adjustment" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                                            }`}>
                                            <Wrench className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold">Modo de Ajuste</div>
                                            <div className="text-xs text-muted-foreground">
                                                {machine.status === "Adjustment"
                                                    ? "Cronômetro em andamento..."
                                                    : "Sinalizar ajuste técnico"}
                                            </div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={machine.status === "Adjustment"}
                                            onChange={(e) => {
                                                if (!e.target.checked) {
                                                    // Turning OFF
                                                    toggleAdjustment(machine.id, false, observation);
                                                    setObservation(""); // Clear after saving
                                                } else {
                                                    // Turning ON
                                                    toggleAdjustment(machine.id, true);
                                                }
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>
                                {machine.status === "Adjustment" && (
                                    <div className="bg-amber-500/5 p-4 rounded-lg border border-amber-500/20 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-xs font-bold text-amber-600 uppercase mb-2 block">
                                            Observação do Ajuste (opcional)
                                        </label>
                                        <textarea
                                            value={observation}
                                            onChange={(e) => setObservation(e.target.value)}
                                            placeholder="Descreva o que está sendo ajustado..."
                                            className="w-full bg-background border border-amber-500/30 rounded-md p-2 text-sm focus:border-amber-500 outline-none"
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (role === "PREPARER" || role === "ADMIN") ? (
                            // PREPARER & ADMIN VIEW (Editable)
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Ordem de Produção (OP)</label>
                                    <input
                                        value={editForm.op}
                                        onChange={(e) => setEditForm({ ...editForm, op: e.target.value })}
                                        className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Código do Item</label>
                                    <input
                                        value={editForm.item}
                                        onChange={(e) => setEditForm({ ...editForm, item: e.target.value })}
                                        className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase font-bold">Tempo de Ciclo</label>
                                        <input
                                            value={editForm.cycleTime}
                                            onChange={(e) => setEditForm({ ...editForm, cycleTime: e.target.value })}
                                            className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground uppercase font-bold">Peças Produzidas</label>
                                        <input
                                            type="number"
                                            value={editForm.pieces}
                                            onChange={(e) => setEditForm({ ...editForm, pieces: Number(e.target.value) })}
                                            className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Meta Total da OP</label>
                                    <input
                                        type="number"
                                        value={editForm.totalTarget}
                                        onChange={(e) => setEditForm({ ...editForm, totalTarget: Number(e.target.value) })}
                                        className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                        placeholder="Ex: 5000"
                                    />
                                </div>
                            </div>
                        ) : null}

                        {/* HD SECTION - PER MACHINE */}
                        <div className="border-t border-border pt-6 mt-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-primary" />
                                HD - Histórico da Máquina
                            </h3>

                            {/* Particularities Section */}
                            <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-lg mb-4">
                                <label className="text-xs font-bold text-purple-600 uppercase mb-2 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4" />
                                    Particularidades (Notas Fixas)
                                </label>
                                <textarea
                                    value={machine.particularities || ""}
                                    onChange={(e) => updateMachineData(machine.id, { particularities: e.target.value })}
                                    placeholder="Ex: Máquina superaquece após 4h..."
                                    className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 outline-none resize-none text-foreground placeholder:text-muted-foreground/50"
                                    rows={3}
                                />
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                                {history.filter(h => h.machineId === machine.id).length === 0 ? (
                                    <div className="pl-6 text-sm text-muted-foreground italic">Nenhum evento registrado.</div>
                                ) : (
                                    history.filter(h => h.machineId === machine.id).map((entry) => (
                                        <div key={entry.id} className="relative flex gap-4 animate-in slide-in-from-left-2">
                                            <div className="absolute left-0 mt-1.5 w-5 h-5 rounded-full border border-border bg-card flex items-center justify-center shrink-0 z-10">
                                                <div className={`w-2 h-2 rounded-full ${entry.category === "Adjustment" ? "bg-amber-500" :
                                                    entry.category === "Setup" ? "bg-blue-500" :
                                                        entry.category === "Maintenance" ? "bg-red-500" : "bg-primary"
                                                    }`} />
                                            </div>
                                            <div className="pl-6 w-full">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{entry.category}</span>
                                                    <time className="text-[10px] text-muted-foreground">{entry.timestamp.toLocaleTimeString()}</time>
                                                </div>
                                                <p className="text-sm mt-0.5">{entry.description}</p>
                                                <div className="text-[10px] text-muted-foreground mt-1">Por: {entry.user}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Interactive Panel */}
                <div className="lg:col-span-2 space-y-6">

                    {role === "OPERATOR" ? (
                        <div className="space-y-6">
                            {/* Drawing Preview Button for Operators */}
                            {(() => {
                                const { items } = useApp();
                                const currentItem = items.find(it => it.id === machine.item);
                                if (currentItem?.drawingData) {
                                    return (
                                        <button
                                            onClick={() => {
                                                const win = window.open();
                                                if (win) win.document.write(`<iframe src="${currentItem.drawingData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            <FileText className="w-5 h-5 text-blue-200" />
                                            Visualizar Desenho Técnico
                                        </button>
                                    );
                                }
                                return null;
                            })()}

                            {machine.status === "Adjustment" && (
                                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6 flex flex-col items-center gap-4 text-center animate-pulse">
                                    <Bot className="w-12 h-12 text-red-500" />
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-red-500 uppercase tracking-tighter">Máquina em Setup</h2>
                                        <p className="text-sm font-bold">O Preparador Carlos Alberto está realizando a troca de lote.</p>
                                    </div>
                                </div>
                            )}

                            {!showNeo ? (
                                <button
                                    onClick={() => setShowNeo(true)}
                                    disabled={machine.status === "Adjustment"}
                                    className={cn(
                                        "w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all group",
                                        machine.status === "Adjustment"
                                            ? "border-muted text-muted-foreground cursor-not-allowed opacity-50"
                                            : "border-primary/30 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5"
                                    )}
                                >
                                    <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                                        <Bot className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">Solicitar Ajuda ao NEO</p>
                                        <p className="text-xs">Clique para iniciar o diagnóstico inteligente</p>
                                    </div>
                                </button>
                            ) : (
                                <NeoChat machine={machine} onClose={() => setShowNeo(false)} />
                            )}
                        </div>
                    ) : (
                        // PREPARER/ADMIN VIEW: History & Adjustments
                        <div className="space-y-6">
                            {/* Adjustment Form */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Registrar Ajuste Realizado
                                </h3>
                                <div className="grid gap-4">
                                    <textarea
                                        className="w-full bg-background border border-border p-3 rounded-md min-h-[80px] focus:border-primary outline-none resize-none"
                                        placeholder="Descreva o ajuste feito na máquina..."
                                    />
                                    <button className="ml-auto bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-md font-bold text-sm shadow-md transition-all">
                                        REGISTRAR AJUSTE
                                    </button>
                                </div>
                            </div>

                            {/* History Log */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                    Histórico de Intervenções
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4 text-sm border-l-2 border-muted pl-4 relative">
                                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-muted" />
                                            <div className="text-muted-foreground w-12 text-xs pt-0.5">10:3{i}</div>
                                            <div>
                                                <div className="font-medium text-foreground">Troca de Inserto de Corte</div>
                                                <div className="text-xs text-muted-foreground">Preparador João • 15 min de parada</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div >
    );
}
