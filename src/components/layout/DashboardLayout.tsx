"use client";

import { BreadcrumbProvider, useBreadcrumbs } from "@/contexts/BreadcrumbContext";
import { User } from "@/types/auth";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar, { BreadcrumbItem } from "./Topbar";

interface DashboardLayoutProps {
    user: User;
    children: ReactNode;
}

// Main layout wrapper with BreadcrumbProvider
export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
    return (
        <BreadcrumbProvider>
            <DashboardLayoutContent user={user}>{children}</DashboardLayoutContent>
        </BreadcrumbProvider>
    );
}

// Inner component that uses breadcrumb context
function DashboardLayoutContent({ user, children }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const { breadcrumbs, updateBreadcrumb } = useBreadcrumbs();

    // Generate breadcrumbs based on current path
    useEffect(() => {
        if (!pathname) return;

        // Skip for root dashboard
        if (pathname === "/dashboard") {
            updateBreadcrumb(pathname, [
                { label: "Dashboard", href: "/dashboard" }
            ]);
            return;
        }

        const pathSegments = pathname.split('/').filter(Boolean);

        // Build breadcrumb items from path segments
        const breadcrumbItems: BreadcrumbItem[] = [];

        // Always start with Dashboard
        breadcrumbItems.push({ label: "Dashboard", href: "/dashboard" });

        // Add path segments as breadcrumbs
        let currentPath = "";
        pathSegments.forEach((segment, index) => {
            if (segment === "dashboard") return; // Skip the dashboard segment as we've already added it

            currentPath += `/${segment}`;

            // Format the label to be more user-friendly
            const label = segment
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            // Last segment is current page (no href)
            if (index === pathSegments.length - 1) {
                breadcrumbItems.push({ label });
            } else {
                breadcrumbItems.push({
                    label,
                    href: index === 0 ? `/${segment}` : currentPath
                });
            }
        });

        updateBreadcrumb(pathname, breadcrumbItems);
    }, [pathname, updateBreadcrumb]);

    // Check if it's mobile on initial render and window resize
    useEffect(() => {
        const checkIfMobile = () => {
            const isMobile = window.innerWidth < 1024;
            setIsCollapsed(isMobile);

            // Close mobile menu if resizing to desktop
            if (!isMobile && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        // Set initial state
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, [isMobileOpen]);

    // Add a class to the body to prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('sidebar-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('sidebar-open');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('sidebar-open');
        };
    }, [isMobileOpen]);

    // Handle clicking outside the sidebar to close it on mobile
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Only trigger on mobile and when the sidebar is open
            if (!isMobileOpen || window.innerWidth >= 1024) return;

            // Check if the click is outside the sidebar
            const sidebar = document.getElementById('mobile-sidebar');
            const topbar = document.getElementById('mobile-topbar');

            if (sidebar &&
                !sidebar.contains(e.target as Node) &&
                topbar &&
                !topbar.contains(e.target as Node)) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    // Also close the sidebar when a navigation occurs
    useEffect(() => {
        if (isMobileOpen && window.innerWidth < 1024) {
            setIsMobileOpen(false);
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed components */}
            <Sidebar
                user={user}
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />
            <Topbar
                user={user}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                breadcrumbs={breadcrumbs}
            />

            {/* Main content with proper spacing */}
            <div
                className={`pt-14 transition-all duration-300 min-h-screen
                    ${isMobileOpen ? "lg:ml-64" : isCollapsed ? "ml-0 lg:ml-20" : "ml-0 lg:ml-64"}`}
            >
                <main className="p-3 sm:p-4 md:p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
