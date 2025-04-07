"use client";

import { BreadcrumbItem } from "@/components/layout/Topbar";
import { useBreadcrumbs } from "@/contexts/BreadcrumbContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface BreadcrumbSetterProps {
    breadcrumbs: BreadcrumbItem[];
}

// Component to explicitly set breadcrumbs for a page
export default function BreadcrumbSetter({ breadcrumbs }: BreadcrumbSetterProps) {
    const { updateBreadcrumb } = useBreadcrumbs();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
            // Make sure to update with the current path
            updateBreadcrumb(pathname, breadcrumbs);
        }

        // Cleanup function that runs when component unmounts
        return () => {
            // If navigating away, we keep the breadcrumbs in context
            // They will be replaced when navigating to a new page
        };
    }, [pathname, breadcrumbs, updateBreadcrumb]);

    // This component doesn't render anything
    return null;
}
