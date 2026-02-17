"use client";

import { useApp } from "@/contexts/AppContext";
import { Wrench, Play, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function MaintenancePage() {
    const { machines, updateMachineStatus } = useApp();

    const handleToggleStatus = (id: string, currentStatus: string) => {
        if (currentStatus === "Maintenance") {
            // Liberar para Produção
            updateMachineStatus(id, "Running");
        } else {
            // Iniciar Manutenção
            updateMachineStatus(id, "Maintenance");
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <Wrench className="w-8 h-8 text-primary" />
                        Gestão de Manutenção
                    </h1>
                    <p className="text-muted-foreground">
                        Controle de paradas e liberação de máquinas.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {machines.map((machine) => (
                    <div
                        key={machine.id}
                        className={`border rounded-xl p-6 transition-all ${machine.status === "Maintenance"
                                ? "bg-red-500/5 border-red-500/20"
                                : "bg-card border-border hover:border-primary/50"
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{machine.id}</h3>
                                <p className="text-sm text-muted-foreground">OP: {machine.op}</p>
                                <p className="text-sm text-muted-foreground">Item: {machine.item}</p>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${machine.status === "Maintenance"
                                    ? "bg-red-500 text-white"
                                    : "bg-green-500 text-white"
                                }`}>
                                {machine.status === "Maintenance" ? "EM MANUTENÇÃO" : "PRODUZINDO"}
                            </div>
                        </div>

                        <button
                            onClick={() => handleToggleStatus(machine.id, machine.status)}
                            className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${machine.status === "Maintenance"
                                    ? "bg-green-600 text-white hover:bg-green-700 shadow-green-900/20"
                                    : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/20"
                                }`}
                        >
                            {machine.status === "Maintenance" ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    LIBERAR PARA PRODUÇÃO
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5" />
                                    INICIAR MANUTENÇÃO
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
