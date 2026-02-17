"use client";

import { DecisionTree } from "@/components/DecisionTree";
import { Bot, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Voltar</span>
                </button>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Bot className="w-8 h-8 text-primary" />
                    Chat de Ajuda NEO
                </h1>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 min-h-[600px]">
                <DecisionTree />
            </div>
        </div>
    );
}
