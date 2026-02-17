"use client";

import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { Plus, UserPlus, Key, Edit2, Trash2, ShieldCheck, X, AlertTriangle } from "lucide-react";

export default function UserManagementPage() {
    const { preparers, addPreparer, updatePreparerPin, resetSystem } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newName, setNewName] = useState("");
    const [newPin, setNewPin] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPin.length === 4) {
            addPreparer(newName, newPin);
            setShowAddModal(false);
            setNewName("");
            setNewPin("");
        }
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser && newPin.length === 4) {
            updatePreparerPin(selectedUser.id, newPin);
            setShowEditModal(false);
            setNewPin("");
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8" />
                        Gestão de Acessos
                    </h1>
                    <p className="text-muted-foreground">Administração de usuários e controle de PINs.</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    ADICIONAR PREPARADOR
                </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do Preparador</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">PIN Atual</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right text-muted-foreground">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {preparers.map((user) => (
                            <tr key={user.id} className="hover:bg-accent/5 transition-colors">
                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 font-mono text-muted-foreground">****</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowEditModal(true);
                                        }}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all"
                                    >
                                        <Key className="w-4 h-4" />
                                        EDITAR PIN
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl">
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <div className="flex justify-between items-center bg-primary/5 -m-6 mb-4 p-6 border-b border-border">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <UserPlus className="w-6 h-6 text-primary" />
                                    Novo Preparador
                                </h3>
                                <button type="button" onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-70">NOME COMPLETO</label>
                                    <input
                                        type="text"
                                        required
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Ex: Carlos Alberto"
                                        className="w-full p-3 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold opacity-70">DEFINIR PIN (4 DÍGITOS)</label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        required
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                                        placeholder="••••"
                                        className="w-full p-3 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary text-center tracking-[1em]"
                                    />
                                </div>
                                <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold mt-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                                    CADASTRAR PREPARADOR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PIN MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl">
                        <form onSubmit={handleEdit} className="p-6 space-y-4 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-2">
                                <Key className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Editar PIN</h3>
                            <p className="text-sm text-muted-foreground">Alterando senha para: <br /><span className="text-foreground font-bold">{selectedUser?.name}</span></p>

                            <input
                                type="password"
                                maxLength={4}
                                required
                                autoFocus
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                                placeholder="NOVO PIN"
                                className="w-full p-3 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary text-center tracking-[1em] text-2xl"
                            />

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="py-3 bg-muted rounded-xl font-bold">CANCELAR</button>
                                <button type="submit" className="py-3 bg-primary text-primary-foreground rounded-xl font-bold">SALVAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Danger Zone: System Reset */}
            <div className="mt-12 p-8 border-2 border-red-500/20 bg-red-500/5 rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-red-500 rounded-xl text-white shadow-lg shadow-red-900/20">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-red-500 uppercase tracking-tighter">Zona de Perigo</h2>
                        <p className="text-sm text-red-500/70 font-medium">Controle de inicialização do sistema.</p>
                    </div>
                </div>

                <div className="bg-card border border-red-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg">Reset Total do Sistema (Produção)</h3>
                        <p className="text-xs text-muted-foreground max-w-md">
                            Esta ação irá zerar todas as peças produzidas, limpar o histórico de manutenção, apagar os logs de setup e resetar o status das máquinas para Offline. Use apenas para o lançamento oficial.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm("ATENÇÃO: Você está prestes a apagar TODOS os dados de produção e histórico. Esta ação é irreversível. Deseja continuar?")) {
                                resetSystem();
                            }
                        }}
                        className="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Zerar Todo o Sistema
                    </button>
                </div>
            </div>
        </div>
    );
}
