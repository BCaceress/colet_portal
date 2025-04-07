"use client";

import { User } from "@/types/auth";
import { Building2, CalendarDays, ChevronRight, LayoutDashboard, Rat, TicketCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
    user: User;
    isCollapsed: boolean;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
}

// Menu category interface
interface MenuCategory {
    name: string;
    items: MenuItem[];
}

interface MenuItem {
    name: string;
    icon: JSX.Element;
    path: string;
}

export default function Sidebar({ user, isCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        "Implantação": true,
        "Suporte": true,
        "Cadastros": true
    });

    // Toggle category expansion
    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    // Enhanced focus management for accessibility
    useEffect(() => {
        if (isMobileOpen && sidebarRef.current) {
            // Set focus to the first focusable element
            const focusableElements = sidebarRef.current.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
            );
            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }

            // Trap focus within sidebar when open on mobile
            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key === 'Tab' && isMobileOpen && window.innerWidth < 1024) {
                    const focusableElements = sidebarRef.current?.querySelectorAll(
                        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                    ) || [];

                    if (focusableElements.length === 0) return;

                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            return () => {
                document.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [isMobileOpen]);

    // Handle scroll behavior for fixed elements
    useEffect(() => {
        const handleNavScroll = () => {
            if (navRef.current) {
                // Stop propagation of scroll events when nav is at boundaries
                const { scrollTop, scrollHeight, clientHeight } = navRef.current;
                if ((scrollTop === 0 && window.event?.deltaY < 0) ||
                    (scrollTop + clientHeight >= scrollHeight && window.event?.deltaY > 0)) {
                    window.event?.preventDefault();
                }
            }
        };

        const navElement = navRef.current;
        if (navElement) {
            navElement.addEventListener('wheel', handleNavScroll, { passive: false });
        }

        return () => {
            if (navElement) {
                navElement.removeEventListener('wheel', handleNavScroll);
            }
        };
    }, []);

    // Also close on Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileOpen && window.innerWidth < 1024) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMobileOpen, setIsMobileOpen]);

    // Reorganized menu structure with categories
    const dashboardItem = {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: "/dashboard"
    };

    const menuCategories: MenuCategory[] = [
        {
            name: "Implantação",
            items: [
                {
                    name: "RATS",
                    icon: <Rat className="h-5 w-5" />,
                    path: "/dashboard/rats"
                }
            ]
        },
        {
            name: "Suporte",
            items: [
                {
                    name: "Tickets",
                    icon: <TicketCheck className="h-5 w-5" />,
                    path: "/dashboard/tickets"
                }
            ]
        },
        {
            name: "Cadastros",
            items: [
                {
                    name: "Clientes",
                    icon: <Building2 className="h-5 w-5" />,
                    path: "/dashboard/clients"
                },
                {
                    name: "Contatos",
                    icon: <Users className="h-5 w-5" />,
                    path: "/dashboard/contacts"
                },
                {
                    name: "Agenda",
                    icon: <CalendarDays className="h-5 w-5" />,
                    path: "/dashboard/calendar"
                }
            ]
        }
    ];

    const isPathActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <>
            {/* Improved overlay for mobile when menu is open */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                id="mobile-sidebar"
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full flex flex-col bg-[#3A3A3A] text-white shadow-lg z-40
                    ${isCollapsed ? "w-14" : "w-60"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    transition-all ease-in-out duration-300`}
                aria-hidden={!isMobileOpen && window.innerWidth < 1024}
            >
                <div className="flex items-center justify-between border-b border-gray-700/50 p-2 bg-[#2A2A2A] h-14">
                    <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}>
                        <Image
                            src="/images/logoColet.png"
                            alt="Colet Logo"
                            width={32}
                            height={32}
                            style={{ width: "auto", height: "auto" }}
                            className={isCollapsed ? "" : "mr-2"}
                            onError={(e) => {
                                e.currentTarget.src = "/vercel.svg";
                            }}
                        />
                        {!isCollapsed && <h1 className="text-base font-bold text-white">Colet Sistemas</h1>}
                    </div>
                </div>

                <nav
                    ref={navRef}
                    className="flex-1 overflow-y-auto py-3 overscroll-contain"
                >
                    <div className="px-2 mb-3">
                        <Link
                            href={dashboardItem.path}
                            className={`flex items-center rounded-lg px-3 py-2 transition-colors duration-200
                            ${isPathActive(dashboardItem.path)
                                    ? 'bg-[#09A08D]/10 text-[#09A08D] border-l-2 border-[#09A08D]'
                                    : 'text-gray-300 hover:bg-[#4A4A4A] hover:text-white'}`}
                            onClick={() => {
                                if (window.innerWidth < 1024) {
                                    setIsMobileOpen(false);
                                }
                            }}
                        >
                            <span className={`${isPathActive(dashboardItem.path) ? 'text-[#09A08D]' : 'text-gray-400'} 
                                ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`}>
                                {dashboardItem.icon}
                            </span>
                            {!isCollapsed && (
                                <span className="font-medium text-sm">
                                    {dashboardItem.name}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="space-y-1 px-2">
                        {menuCategories.map((category) => (
                            <div key={category.name} className="mb-2">
                                {!isCollapsed ? (
                                    <div
                                        className="flex items-center justify-between text-xs uppercase text-gray-400 font-semibold px-3 py-1.5 cursor-pointer"
                                        onClick={() => toggleCategory(category.name)}
                                    >
                                        <span>{category.name}</span>
                                        <ChevronRight
                                            className={`h-3 w-3 transition-transform ${expandedCategories[category.name] ? 'rotate-90' : ''}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="border-b border-gray-700/30 my-2"></div>
                                )}

                                {(expandedCategories[category.name] || isCollapsed) && (
                                    <ul className={`space-y-0.5 ${!isCollapsed ? 'pl-1' : ''}`}>
                                        {category.items.map((item) => {
                                            const isActive = isPathActive(item.path);
                                            return (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.path}
                                                        className={`flex items-center rounded-lg px-3 py-2 transition-colors duration-200
                                                        ${isActive
                                                                ? 'bg-[#09A08D]/10 text-[#09A08D] border-l-2 border-[#09A08D]'
                                                                : 'text-gray-300 hover:bg-[#4A4A4A] hover:text-white'}`}
                                                        onClick={() => {
                                                            if (window.innerWidth < 1024) {
                                                                setIsMobileOpen(false);
                                                            }
                                                        }}
                                                        title={isCollapsed ? item.name : undefined}
                                                    >
                                                        <span className={`${isActive ? 'text-[#09A08D]' : 'text-gray-400'} 
                                                            ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`}>
                                                            {item.icon}
                                                        </span>
                                                        {!isCollapsed && (
                                                            <span className="font-medium text-sm">{item.name}</span>
                                                        )}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
}
