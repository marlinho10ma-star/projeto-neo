"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthorized, role, loading } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const isPublicRoute = pathname === "/";

        // Redirect if not authorized and trying to access restricted content
        // Operator doesn't need extra pin authorization besides the selection
        if (!isPublicRoute && !isAuthorized) {
            router.push("/");
        }
    }, [isAuthorized, role, pathname, router, loading]);

    if (loading) return null;

    return <>{children}</>;
}
