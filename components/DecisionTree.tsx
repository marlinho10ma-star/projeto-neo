"use client";

import { useState } from "react";
import { ChevronRight, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

import { useApp } from "@/contexts/AppContext";

const CATEGORIES = [
    { id: "comprimento", label: "Comprimento" },
    { id: "diametro", label: "Diâmetro" },
    { id: "rebarba", label: "Rebarba" },
    { id: "quebra", label: "Quebra de Ferramenta" },
    { id: "variacoes", label: "Variações" },
    { id: "alarmes", label: "Alarmes" },
    { id: "acabamento", label: "Acabamento" },
];

export function DecisionTree() {
    const { solutions } = useApp();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    if (selectedCategory) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-primary flex items-center gap-1 hover:underline mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para categorias
                </button>

                <h3 className="text-xl font-bold capitalize flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Problema: {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </h3>

                <div className="bg-card/50 border border-border rounded-lg p-4 space-y-3">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        Soluções Sugeridas pelo NEO:
                    </p>
                    <ul className="space-y-3">
                        {solutions[selectedCategory]?.map((sol, idx) => (
                            <li key={idx} className="flex gap-3 items-start bg-background p-3 rounded-md border border-border/50">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{sol}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Como posso ajudar hoje?
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="flex items-center justify-between p-4 bg-card border border-border hover:border-primary hover:bg-primary/5 rounded-lg transition-all text-left group"
                    >
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                            {cat.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
}
