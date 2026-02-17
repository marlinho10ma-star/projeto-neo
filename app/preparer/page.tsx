"use client";

import { useApp } from "@/contexts/AppContext";
import { MachineCard } from "@/components/MachineCard";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PreparerPage() {
    const { machines } = useApp();
    const router = useRouter();

    // Preparer focuses on Stopped or Maintenance machines
    const priorityMachines = machines.filter(m => m.status !== 'Running');

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-yellow-500 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Gestão Técnica
                    </h1>
                    <div className="text-sm text-muted-foreground">
                        {priorityMachines.length} máquinas requerem atenção imediata
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="bg-card border border-border px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-accent">
                        <Filter className="w-4 h-4" />
                        Filtrar
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            className="bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm w-64"
                            placeholder="Buscar máquina..."
                        />
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider text-sm">
                Prioridade Alta -&gt; Paradas / Manutenção
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {priorityMachines.map((machine) => (
                    <MachineCard
                        key={machine.id}
                        {...machine}
                        onClick={() => router.push(`/operator/machine/${machine.id}`)}
                    />
                ))}
                {priorityMachines.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                        <p>Nenhuma máquina parada no momento. Ótimo trabalho!</p>
                    </div>
                )}
            </div>

            <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider text-sm mt-8">
                Todas as Máquinas
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-75">
                {machines.filter(m => m.status === 'Running').map((machine) => (
                    <MachineCard
                        key={machine.id}
                        {...machine}
                        onClick={() => router.push(`/operator/machine/${machine.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}
