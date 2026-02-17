"use client";

import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
    const { role, setRole } = useApp();

    return (
        <div className="flex bg-card border border-border rounded-lg p-1 mb-4">
            {(["OPERATOR", "PREPARER", "ADMIN"] as const).map((r) => (
                <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                        "flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                        role === r
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    {r === "OPERATOR" && "OPERADOR"}
                    {r === "PREPARER" && "PREPARADOR"}
                    {r === "ADMIN" && "ADMIN"}
                </button>
            ))}
        </div>
    );
}
