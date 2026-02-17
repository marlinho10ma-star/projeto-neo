import { cn } from "@/lib/utils";

type Status = "Running" | "Stopped" | "Maintenance" | "Offline" | "Adjustment";

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const styles = {
        Running: "bg-green-500/20 text-green-500 border-green-500/50",
        Stopped: "bg-red-500/20 text-red-500 border-red-500/50",
        Maintenance: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
        Offline: "bg-gray-500/20 text-gray-400 border-gray-500/50",
        Adjustment: "bg-amber-500/20 text-amber-500 border-amber-500/50",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                styles[status],
                className
            )}
        >
            {status === "Running" && "Produzindo"}
            {status === "Stopped" && "Parada"}
            {status === "Maintenance" && "Manutenção"}
            {status === "Offline" && "Offline"}
            {status === "Adjustment" && "Em Ajuste"}
        </div>
    );
}
