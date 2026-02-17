import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CheckCircle, AlertTriangle, ChevronRight, X } from "lucide-react";
import { Machine, useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface NeoChatProps {
    machine: Machine;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: "neo" | "user";
    text: string;
    actions?: Array<{ label: string; onClick: () => void; variant?: "primary" | "secondary" | "danger" }>;
    isTyping?: boolean;
}

export function NeoChat({ machine, onClose }: NeoChatProps) {
    const { history, knowledgeBase, addHistoryEntry, role } = useApp();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            simulateTyping([
                {
                    text: `Olá, parceiro! Vejo que você está na **${machine.id}** rodando o item **${machine.item}**.`,
                    sender: "neo"
                },
                {
                    text: "Em que posso ajudar hoje?",
                    sender: "neo",
                    actions: knowledgeBase.map(kb => ({
                        label: kb.symptom,
                        onClick: () => handleSymptomSelect(kb.id),
                        variant: "secondary"
                    }))
                }
            ]);
        }
    }, [machine.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateTyping = (newMessages: Omit<Message, "id">[]) => {
        let delay = 0;
        newMessages.forEach((msg, index) => {
            const messageId = Math.random().toString(36).substring(7);

            // Add "Typing..." indicator if it's from NEO
            if (msg.sender === "neo") {
                setTimeout(() => {
                    setMessages(prev => [...prev, { id: `typing-${messageId}`, sender: "neo", text: "...", isTyping: true }]);
                }, delay);
                delay += 800; // Typing duration
            }

            setTimeout(() => {
                setMessages(prev => {
                    const filtered = prev.filter(m => !m.isTyping);
                    return [...filtered, { ...msg, id: messageId }];
                });
            }, delay);

            delay += 200; // Small pause between messages
        });
    };

    const handleSymptomSelect = (kbId: string) => {
        const kb = knowledgeBase.find(k => k.id === kbId);
        if (!kb) return;

        // User selection
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: kb.symptom }]);

        // NEO Logic: Check History first
        const historyMatches = history.filter(h => h.machineId === machine.id && h.category === "Adjustment" && h.description.toLowerCase().includes(kb.symptom.toLowerCase()));

        if (historyMatches.length > 0) {
            // Found in History
            const lastMatch = historyMatches[0];
            simulateTyping([
                {
                    text: `Encontrei um registro no histórico dessa máquina!`,
                    sender: "neo"
                },
                {
                    text: `Em ${new Date(lastMatch.timestamp).toLocaleDateString()}, o ajuste foi: "${lastMatch.description}".`,
                    sender: "neo"
                },
                {
                    text: "Deseja tentar essa solução novamente?",
                    sender: "neo",
                    actions: [
                        { label: "Sim, tentar soluçao do histórico", onClick: () => handleSolutionFeedback(kbId, true, "Histórico"), variant: "primary" },
                        { label: "Não, ver outras causas", onClick: () => showCauses(kb), variant: "secondary" }
                    ]
                }
            ]);
        } else {
            // No history, go to standard KB
            showCauses(kb);
        }
    };

    const showCauses = (kb: any) => {
        simulateTyping([
            {
                text: "Entendido. Vamos analisar as causas prováveis.",
                sender: "neo"
            },
            ...kb.causes.map((cause: any) => ({
                text: `**Causa:** ${cause.text}\n\n**Solução:** ${cause.solution}`,
                sender: "neo" as const, // Type assertion fix
                actions: [
                    { label: "Resolveu!", onClick: () => handleSolutionFeedback(kb.id, true, cause.solution), variant: "primary" as const },
                    { label: "Não resolveu", onClick: () => { }, variant: "danger" as const } // Placeholder for next step
                ]
            }))
        ]);
    };

    const handleSolutionFeedback = (kbId: string, success: boolean, solution: string) => {
        if (success) {
            addHistoryEntry({
                machineId: machine.id,
                category: "Feedback",
                description: `Solução de sucesso aplicada pelo NEO: ${solution}`,
                user: role
            });
            simulateTyping([
                {
                    text: "Ótimo! Registrei essa solução no histórico da máquina para o futuro. 🚀",
                    sender: "neo"
                },
                {
                    text: "Precisa de mais alguma coisa?",
                    sender: "neo",
                    actions: [
                        { label: "Encerrar Atendimento", onClick: onClose, variant: "secondary" }
                    ]
                }
            ]);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-background rounded-xl border border-border shadow-2xl overflow-hidden relative">
            {/* Header: PCP Info Stick */}
            <div className="bg-muted/50 p-2 border-b border-border flex items-center justify-between px-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>META: <strong className="text-foreground">{machine.totalTarget || "-"}</strong></span>
                    <span>PROG: <strong className="text-foreground">{machine.pieces || 0}</strong></span>
                </div>
                <div>
                    PREVISÃO: <strong className="text-green-500">
                        {(() => {
                            try {
                                if (!machine.cycleTime || machine.cycleTime === "-" || !machine.totalTarget) return "-";
                                const total = machine.totalTarget ?? 0;
                                const current = machine.pieces ?? 0;
                                const remaining = Math.max(0, total - current);

                                if (remaining <= 0) return "CONCLUÍDO";

                                // Parse Cycle Time (e.g. "1:30,5" -> 90.5s)
                                const parts = String(machine.cycleTime).replace(',', '.').split(':');
                                let secondsPerPiece = 0;
                                if (parts.length === 2) {
                                    secondsPerPiece = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
                                } else {
                                    secondsPerPiece = parseFloat(parts[0]);
                                }

                                if (isNaN(secondsPerPiece) || secondsPerPiece <= 0) return "-";

                                const remainingSeconds = remaining * secondsPerPiece;
                                const now = new Date();
                                const finishTime = new Date(now.getTime() + remainingSeconds * 1000);

                                const isToday = finishTime.getDate() === now.getDate();
                                const timeStr = finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return isToday ? `Hoje às ${timeStr}` : `Amanhã às ${timeStr}`;
                            } catch (e) {
                                console.error("NeoChat Forecast Error:", e);
                                return "-";
                            }
                        })()}
                    </strong>
                </div>
            </div>

            {/* Header Title */}
            <div className="p-4 bg-primary/10 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    <div>
                        <h3 className="font-bold text-foreground">NEO Copilot</h3>
                        <p className="text-xs text-muted-foreground">Assistente Técnico Inteligente</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-background/20 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.sender === "neo" ? "bg-primary/20" : "bg-muted"
                        )}>
                            {msg.sender === "neo" ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-muted-foreground" />}
                        </div>

                        <div className="space-y-2">
                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.sender === "neo" ? "bg-card border border-border rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
                            )}>
                                {msg.isTyping ? (
                                    <div className="flex gap-1 h-5 items-center">
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                                    </div>
                                ) : (
                                    // Basic Markdown parsing for Bold
                                    msg.text.split("**").map((part, i) =>
                                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                    )
                                )}
                            </div>

                            {/* Actions */}
                            {msg.actions && (
                                <div className="flex flex-wrap gap-2">
                                    {msg.actions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={action.onClick}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-bold transition-all transform hover:scale-105 active:scale-95 border",
                                                action.variant === "primary" ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" :
                                                    action.variant === "danger" ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20" :
                                                        "bg-background text-foreground border-border hover:bg-muted"
                                            )}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Mock for now, could be real chat later) */}
            <div className="p-4 border-t border-border bg-background">
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); /* Handle manual input later */ }}>
                    <input
                        disabled
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Selecione uma opção acima..."
                        className="flex-1 bg-muted/50 border-transparent focus:border-primary rounded-lg px-4 py-2 text-sm outline-none cursor-not-allowed opacity-50"
                    />
                    <button disabled className="p-2 bg-primary/50 text-primary-foreground rounded-lg cursor-not-allowed">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
