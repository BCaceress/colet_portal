"use client";

import { BreadcrumbItem } from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface BreadcrumbContextType {
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
    updateBreadcrumb: (path: string, breadcrumbs: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [breadcrumbsMap, setBreadcrumbsMap] = useState<Record<string, BreadcrumbItem[]>>({});
    const [currentPath, setCurrentPath] = useState<string>("");
    const pathname = usePathname();

    // Update current path whenever the route changes, but only if it has changed
    useEffect(() => {
        if (pathname && currentPath !== pathname) {
            setCurrentPath(pathname);
        }
    }, [pathname, currentPath]);

    // Memoize the breadcrumbs value to prevent unnecessary re-renders
    const breadcrumbs = useMemo(() => {
        return breadcrumbsMap[currentPath] || [];
    }, [breadcrumbsMap, currentPath]);

    // Set breadcrumbs for current page - wrapped in useCallback to prevent recreation on each render
    const setBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
        setBreadcrumbsMap(prev => ({
            ...prev,
            [currentPath]: newBreadcrumbs,
        }));
    }, [currentPath]);

    // Update breadcrumbs for a specific path - wrapped in useCallback
    const updateBreadcrumb = useCallback((path: string, newBreadcrumbs: BreadcrumbItem[]) => {
        setBreadcrumbsMap(prev => ({
            ...prev,
            [path]: newBreadcrumbs,
        }));
    }, []);

    // Memoize the entire context value object
    const contextValue = useMemo(() => ({
        breadcrumbs,
        setBreadcrumbs,
        updateBreadcrumb
    }), [breadcrumbs, setBreadcrumbs, updateBreadcrumb]);

    return (
        <BreadcrumbContext.Provider value={contextValue}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumbs() {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
    }
    return context;
}
