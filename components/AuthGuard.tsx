"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthorized, role } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Basic route protection
        const isPublicRoute = pathname === "/";

        // Redirect if not authorized and trying to access restricted content
        // Exception: Operator access is free
        if (!isPublicRoute && role !== "OPERATOR" && !isAuthorized) {
            router.push("/");
        }
    }, [isAuthorized, role, pathname, router]);

    return <>{children}</>;
}
