"use client";

import { useApp } from "@/contexts/AppContext";
import { History, Wrench, Settings, ClipboardList, PenTool } from "lucide-react";

export default function HDPage() {
    const { history } = useApp();

    const getIcon = (category: string) => {
        switch (category) {
            case "Adjustment": return <Wrench className="w-5 h-5 text-amber-500" />;
            case "Setup": return <Settings className="w-5 h-5 text-blue-500" />;
            case "Maintenance": return <PenTool className="w-5 h-5 text-red-500" />;
            case "Particularities": return <ClipboardList className="w-5 h-5 text-purple-500" />;
            default: return <History className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const getBorderColor = (category: string) => {
        switch (category) {
            case "Adjustment": return "border-amber-500/50 hover:border-amber-500";
            case "Setup": return "border-blue-500/50 hover:border-blue-500";
            case "Maintenance": return "border-red-500/50 hover:border-red-500";
            case "Particularities": return "border-purple-500/50 hover:border-purple-500";
            default: return "border-border";
        }
    };

    return (
        <div className="space-y-6 pb-20 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" />
                        HD - Histórico de Dados
                    </h1>
                    <p className="text-muted-foreground">
                        Linha do tempo de eventos, ajustes e manutenções.
                    </p>
                </div>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {history.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground">
                        Nenhum evento registrado no histórico ainda.
                    </div>
                ) : (
                    history.map((entry) => (
                        <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                {getIcon(entry.category)}
                            </div>

                            {/* Card content */}
                            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-xl border shadow-sm transition-all ${getBorderColor(entry.category)}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-lg">{entry.machineId}</span>
                                    <time className="font-mono text-xs text-muted-foreground">
                                        {entry.timestamp.toLocaleTimeString()} • {entry.timestamp.toLocaleDateString()}
                                    </time>
                                </div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                    {entry.category}
                                </div>
                                <p className="text-foreground">
                                    {entry.description}
                                </p>
                                <div className="mt-2 text-xs text-muted-foreground text-right italic">
                                    Registrado por: {entry.user}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
