"use client";

import { useApp } from "@/contexts/AppContext";
import { MachineCard } from "@/components/MachineCard";
import { Search, Filter, AlertTriangle, Network } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PreparerPage() {
    const { machines } = useApp();
    const router = useRouter();

    // Visual Panel: Focus on non-running machines but show all for monitoring
    const priorityMachines = machines.filter(m => m.status !== 'Running');
    const runningMachines = machines.filter(m => m.status === 'Running');

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Network className="w-6 h-6 text-primary" />
                        Grid de Máquinas (Monitoramento)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visão rápida do status de produção. Use 'Ajustes de OP' para edições.
                    </p>
                </div>
            </div>

            {priorityMachines.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Atenção Necessária
                    </h2>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {priorityMachines.map((machine) => (
                            <MachineCard
                                key={machine.id}
                                {...machine}
                                onClick={() => router.push(`/operator/machine/${machine.id}`)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Em Produção
                </h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-80">
                    {runningMachines.map((machine) => (
                        <MachineCard
                            key={machine.id}
                            {...machine}
                            onClick={() => router.push(`/operator/machine/${machine.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
