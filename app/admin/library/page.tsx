"use client";

import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { FileImage, FileText, Upload, Plus, Package } from "lucide-react";

export default function LibraryPage() {
    const { items, addItem } = useApp();
    const [newItem, setNewItem] = useState({ id: "", name: "" });
    const [mockUploads, setMockUploads] = useState<{ draw: boolean, photo: boolean }>({ draw: false, photo: false });

    const handleRegister = () => {
        if (!newItem.id || !newItem.name) return;
        addItem({ ...newItem });
        setNewItem({ id: "", name: "" });
        setMockUploads({ draw: false, photo: false });
        alert("Item cadastrado com sucesso!");
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Itens</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* List Area */}
                <div className="md:col-span-8 space-y-4">
                    <div className="rounded-xl border bg-card p-6 min-h-[400px]">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Itens Registrados
                        </h2>

                        <div className="grid gap-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/50 transition-colors">
                                    <div>
                                        <h3 className="font-bold text-foreground">{item.id}</h3>
                                        <p className="text-sm text-muted-foreground">{item.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md" title="Desenho Técnico">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-md" title="Foto de Setup">
                                            <FileImage className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Registration Panel */}
                <div className="md:col-span-4 space-y-4">
                    <div className="rounded-xl border bg-card p-6 sticky top-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Novo Cadastro
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground">Código do Item</label>
                                <input
                                    value={newItem.id}
                                    onChange={e => setNewItem({ ...newItem, id: e.target.value })}
                                    className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                    placeholder="Ex: 109.497-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nome / Descrição</label>
                                <input
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-background border border-border p-2 rounded-md mt-1 focus:border-primary outline-none"
                                    placeholder="Ex: Eixo Principal"
                                />
                            </div>

                            <button
                                onClick={() => setMockUploads(prev => ({ ...prev, draw: !prev.draw }))}
                                className={`w-full h-20 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 group ${mockUploads.draw ? "border-green-500 bg-green-500/10" : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                            >
                                <FileText className={`w-6 h-6 ${mockUploads.draw ? "text-green-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {mockUploads.draw ? "Desenho Anexado!" : "Upload Desenho (PDF)"}
                                </span>
                            </button>

                            <button
                                onClick={() => setMockUploads(prev => ({ ...prev, photo: !prev.photo }))}
                                className={`w-full h-20 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 group ${mockUploads.photo ? "border-green-500 bg-green-500/10" : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    }`}
                            >
                                <FileImage className={`w-6 h-6 ${mockUploads.photo ? "text-green-500" : "text-muted-foreground"}`} />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {mockUploads.photo ? "Foto Anexada!" : "Upload Foto (JPG)"}
                                </span>
                            </button>

                            <button
                                onClick={handleRegister}
                                disabled={!newItem.id || !newItem.name}
                                className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-bold text-sm shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                CADASTRAR ITEM
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
