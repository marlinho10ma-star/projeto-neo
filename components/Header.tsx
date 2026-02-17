import { Network } from "lucide-react";
import Link from "next/link";

export function Header() {
    return (
        <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 w-full">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity" title="Ir para Home">
                <Network className="w-6 h-6" />
                <span>NEO</span>
            </Link>
        </header>
    );
}
