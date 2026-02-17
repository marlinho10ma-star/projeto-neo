"use client";

import { useApp, UserRole } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { HardHat, Users, ShieldCheck, ArrowRight, X, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ProfileSelector() {
  const { login } = useApp();
  const router = useRouter();
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSelectRole = (role: UserRole) => {
    if (role === "OPERATOR") {
      login("", "OPERATOR");
      router.push("/operator");
    } else {
      setSelectedRole(role);
      setShowPinModal(true);
      setError("");
      setPin("");
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (login(pin, selectedRole)) {
      if (selectedRole === "PREPARER") router.push("/preparer");
      else if (selectedRole === "ADMIN") router.push("/dashboard");
      setShowPinModal(false);
    } else {
      setError("PIN incorreto. Tente novamente");
      setPin("");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary drop-shadow-sm">
              NEO SYSTEM
            </h1>
            <p className="text-xl text-muted-foreground">
              Selecione seu perfil de acesso para continuar
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 pt-8">
          {/* Profiles rendering... */}
          <button
            onClick={() => handleSelectRole("OPERATOR")}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-primary hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 h-80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className="w-20 h-20 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="text-center space-y-2 z-10">
              <h3 className="text-2xl font-bold">OPERADOR</h3>
              <p className="text-sm text-muted-foreground">Monitoramento e Chat Inteligente</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all z-10">
              ACESSAR <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleSelectRole("PREPARER")}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-yellow-500 hover:bg-yellow-500/5 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 h-80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <HardHat className="w-20 h-20 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
            <div className="text-center space-y-2 z-10">
              <h3 className="text-2xl font-bold">PREPARADOR</h3>
              <p className="text-sm text-muted-foreground">Ajustes e Trocas de Turno</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-yellow-500 opacity-0 group-hover:opacity-100 transition-all z-10">
              PROTEGIDO <ShieldCheck className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => handleSelectRole("ADMIN")}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 hover:border-red-500 hover:bg-red-500/5 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 h-80"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShieldCheck className="w-20 h-20 text-muted-foreground group-hover:text-red-500 transition-colors" />
            <div className="text-center space-y-2 z-10">
              <h3 className="text-2xl font-bold">ADMIN</h3>
              <p className="text-sm text-muted-foreground">Gestão Total e Relatórios</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10">
              RESTRITO <ShieldCheck className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Acesso Restrito
                </div>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Digite seu PIN de 4 dígitos para acessar o perfil
                  <span className="font-bold text-foreground ml-1">{selectedRole}</span>
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                    placeholder="••••"
                    className="w-full text-center text-4xl tracking-[1em] font-mono py-4 bg-muted border-none rounded-xl focus:ring-2 focus:ring-primary transition-all"
                  />
                  {error && (
                    <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 flex items-center justify-center gap-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="py-3 px-4 bg-muted hover:bg-muted/80 rounded-xl font-bold transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    CONFIRMAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
