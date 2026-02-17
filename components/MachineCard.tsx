import { Clock, Box, Hammer } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Machine } from "@/contexts/AppContext";

interface MachineCardProps extends Machine {
    onClick?: () => void;
}

export function MachineCard({ id, item, op, cycleTime, status, lastReading, totalTarget, onClick, ...props }: MachineCardProps) {
    const isMaintenance = status === "Maintenance";

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-xl border bg-card p-5 transition-all active:scale-95 cursor-pointer select-none",
                isMaintenance ? "border-yellow-500/50 bg-yellow-950/10" :
                    status === "Adjustment" ? "border-amber-500/50 bg-amber-950/5 animate-pulse-subtle" :
                        "border-border hover:border-primary/50"
            )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl text-foreground">{id}</h3>
                <StatusBadge status={status as any} />
            </div>

            {/* Details - Larger Text for Touch */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Box className="w-5 h-5 text-primary" />
                        <span className="font-medium">Item:</span>
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Hammer className="w-5 h-5 text-primary" />
                        <span className="font-medium">OP:</span>
                    </div>
                    <span className="text-foreground font-medium">{op}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground text-sm font-medium">Ciclo:</span>
                    </div>
                    <div className="text-right">
                        <span className="font-mono font-bold text-foreground text-xl block">{cycleTime}</span>
                        {lastReading && (
                            <span className="text-[10px] text-yellow-500 font-semibold">{lastReading}</span>
                        )}
                        {/* Progress Bar (Mini) */}
                        {totalTarget && (
                            <div className="w-20 h-1 bg-border rounded-full mt-1 ml-auto overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${Math.min(((props.pieces || 0) / totalTarget) * 100, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorator for active state */}
            {status === "Running" && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-green-500 shadow-[0_0_12px_4px_rgba(34,197,94,0.4)]" />
            )}
            {status === "Running" && (
                <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
            )}
            {status === "Adjustment" && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-amber-500 shadow-[0_0_12px_4px_rgba(245,158,11,0.4)]" />
            )}
            {status === "Adjustment" && (
                <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
            )}
        </div>
    );
}
