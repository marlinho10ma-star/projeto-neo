"use client";

import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { Save, Plus, Trash2, Bot } from "lucide-react";

const CATEGORIES = [
    { id: "comprimento", label: "Comprimento" },
    { id: "diametro", label: "Diâmetro" },
    { id: "rebarba", label: "Rebarba" },
    { id: "quebra", label: "Quebra de Ferramenta" },
    { id: "variacoes", label: "Variações" },
    { id: "alarmes", label: "Alarmes" },
    { id: "acabamento", label: "Acabamento" },
];

export default function DecisionTreeEditorPage() {
    const { solutions, updateSolutions } = useApp();
    const [activeCategory, setActiveCategory] = useState("comprimento");
    const [newSolution, setNewSolution] = useState("");

    const currentSolutions = solutions[activeCategory] || [];

    const handleAdd = () => {
        if (!newSolution.trim()) return;
        updateSolutions(activeCategory, [...currentSolutions, newSolution]);
        setNewSolution("");
    };

    const handleRemove = (index: number) => {
        const updated = currentSolutions.filter((_, i) => i !== index);
        updateSolutions(activeCategory, updated);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Bot className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Base de Conhecimento NEO</h1>
                    <p className="text-muted-foreground">Gerencie as soluções sugeridas pelo assistente.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Categories */}
                <div className="md:col-span-3 space-y-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card hover:bg-accent text-foreground"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div className="md:col-span-9 space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            Editando: <span className="text-primary">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>
                        </h3>

                        <div className="space-y-3 mb-6">
                            {currentSolutions.map((sol, idx) => (
                                <div key={idx} className="flex items-center gap-3 group">
                                    <div className="flex-1 p-3 bg-background border border-border rounded-md text-sm">
                                        {sol}
                                    </div>
                                    <button
                                        onClick={() => handleRemove(idx)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={newSolution}
                                onChange={(e) => setNewSolution(e.target.value)}
                                placeholder="Digite uma nova solução técnica..."
                                className="flex-1 bg-background border border-border rounded-md px-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary/90"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
