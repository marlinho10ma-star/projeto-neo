import { Network } from "lucide-react";
import Link from "next/link";

export function Header() {
    return (
        <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-2 md:hidden">
                <Network className="w-6 h-6 text-primary" />
                <span className="font-black text-xl tracking-tighter text-primary">NEO</span>
            </div>
        </header>
    );
}
