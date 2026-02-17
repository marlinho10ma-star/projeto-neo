"use client";

import { useApp } from "@/contexts/AppContext";
import { useState, useRef } from "react";
import { FileImage, FileText, Upload, Plus, Package, Eye, X, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
    const { items, addItem, removeItem, addHistoryEntry } = useApp();
    const [newItem, setNewItem] = useState({ id: "", name: "" });
    const [files, setFiles] = useState<{ draw?: { name: string, data: string }, photo?: { name: string, data: string } }>({});
    const [itemToDelete, setItemToDelete] = useState<any | null>(null);

    // Hidden inputs refs
    const drawInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'draw' | 'photo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFiles(prev => ({
                ...prev,
                [type]: { name: file.name, data: reader.result as string }
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRegister = () => {
        if (!newItem.id || !newItem.name) return;

        addItem({
            ...newItem,
            drawingData: files.draw?.data,
            photoData: files.photo?.data
        });

        // Log to Handover if drawing is updated
        if (files.draw) {
            addHistoryEntry({
                machineId: "Global",
                category: "Feedback",
                description: `Novo desenho técnico atualizado para o item ${newItem.id}`,
                user: "Sistema (Admin)"
            });
        }

        setNewItem({ id: "", name: "" });
        setFiles({});
        alert("Item cadastrado com sucesso!");
    };

    const viewFile = (data?: string) => {
        if (!data) return;
        const win = window.open();
        if (win) {
            win.document.write(`<iframe src="${data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Itens</h1>
                    <p className="text-sm text-muted-foreground">Repositório central de desenhos técnicos e fotos de setup.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* List Area */}
                <div className="md:col-span-8 space-y-4">
                    <div className="rounded-xl border bg-card p-4 md:p-6 min-h-[400px]">
                        <h2 className="font-semibold text-lg mb-6 flex items-center gap-2 border-b pb-4">
                            <Package className="w-5 h-5 text-primary" />
                            Itens Registrados
                        </h2>

                        <div className="flex flex-col gap-3">
                            {items.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic text-center py-10">Nenhum item cadastrado.</p>
                            ) : items.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-xl shadow-sm hover:border-primary/50 transition-all group gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                                            {item.photoData ? (
                                                <img src={item.photoData} alt={item.id} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-8 h-8 text-muted-foreground/30" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-lg text-foreground uppercase tracking-tighter truncate">{item.id}</h3>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">{item.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        <button
                                            onClick={() => viewFile(item.drawingData)}
                                            disabled={!item.drawingData}
                                            className={cn(
                                                "flex-1 sm:flex-none p-3 rounded-xl border transition-all flex items-center justify-center gap-2",
                                                item.drawingData
                                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white"
                                                    : "bg-muted text-muted-foreground/30 border-transparent cursor-not-allowed"
                                            )}
                                            title={item.drawingData ? "Visualizar Desenho" : "Sem Desenho"}
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase md:hidden lg:inline">DESENHO</span>
                                        </button>

                                        <button
                                            onClick={() => viewFile(item.photoData)}
                                            disabled={!item.photoData}
                                            className={cn(
                                                "flex-1 sm:flex-none p-3 rounded-xl border transition-all flex items-center justify-center gap-2",
                                                item.photoData
                                                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500 hover:text-white"
                                                    : "bg-muted text-muted-foreground/30 border-transparent cursor-not-allowed"
                                            )}
                                            title={item.photoData ? "Visualizar Foto" : "Sem Foto"}
                                        >
                                            <FileImage className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase md:hidden lg:inline">FOTO SETUP</span>
                                        </button>

                                        <button
                                            onClick={() => setItemToDelete(item)}
                                            className="p-3 rounded-xl border border-transparent text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                                            title="Excluir Item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Registration Panel */}
                <div className="md:col-span-4 space-y-4">
                    <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 sticky top-6 shadow-xl">
                        <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-primary">
                            <Plus className="w-5 h-5" />
                            Novo Cadastro
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Código do Item</label>
                                <input
                                    value={newItem.id}
                                    onChange={e => setNewItem({ ...newItem, id: e.target.value })}
                                    className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold"
                                    placeholder="Ex: 109.497-1"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome / Descrição</label>
                                <input
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-muted/30 border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                                    placeholder="Ex: Eixo Principal"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    ref={drawInputRef}
                                    onChange={(e) => handleFileUpload(e, 'draw')}
                                />
                                <button
                                    onClick={() => drawInputRef.current?.click()}
                                    className={cn(
                                        "h-24 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 group",
                                        files.draw ? "border-blue-500 bg-blue-500/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                >
                                    {files.draw ? (
                                        <>
                                            <FileText className="w-6 h-6 text-blue-500" />
                                            <span className="text-[9px] font-black text-blue-500 uppercase px-2 text-center truncate w-full">
                                                {files.draw.name}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase">Desenho PDF</span>
                                        </>
                                    )}
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={photoInputRef}
                                    onChange={(e) => handleFileUpload(e, 'photo')}
                                />
                                <button
                                    onClick={() => photoInputRef.current?.click()}
                                    className={cn(
                                        "h-24 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 overflow-hidden group",
                                        files.photo ? "border-purple-500" : "border-border hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                >
                                    {files.photo ? (
                                        <img src={files.photo.data} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase">Foto JPG</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={handleRegister}
                                disabled={!newItem.id || !newItem.name}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                CADASTRAR ITEM
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-4 bg-red-500/10 rounded-full">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold uppercase tracking-tight">Confirmar Exclusão</h3>
                                <p className="text-sm text-muted-foreground">
                                    Tem certeza que deseja excluir o item <span className="font-black text-foreground">{itemToDelete.id}</span>?
                                    Esta ação não pode ser desfeita e removerá todos os arquivos vinculados.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full mt-4">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="px-4 py-3 rounded-xl border border-border font-bold text-xs uppercase hover:bg-muted transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={() => {
                                        removeItem(itemToDelete.id);
                                        setItemToDelete(null);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase shadow-lg shadow-red-900/20 transition-all"
                                >
                                    EXCLUIR DEFINITIVAMENTE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
