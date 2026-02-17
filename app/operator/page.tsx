"use client";

import { MachineCard } from "@/components/MachineCard";
import { useApp } from "@/contexts/AppContext";
import { Search, Plus } from "lucide-react";

import { useRouter } from "next/navigation";

export default function OperatorPage() {
    const { machines } = useApp();
    const router = useRouter();

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Painel de Produção</h1>
                    <div className="text-sm text-muted-foreground">
                        {machines.filter(m => m.status === 'Running').length} máquinas produzindo
                    </div>
                </div>

                <div className="flex items-center gap-2">
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {machines.map((machine) => (
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
