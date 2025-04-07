"use client";

import { useBreadcrumbs } from "@/contexts/BreadcrumbContext";
import { User } from "@/types/auth";
import { Bell, ChevronDown, ChevronRight, Cog, LogOut, Menu, Shield, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Define a type for breadcrumb items
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface TopbarProps {
    user: User;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
}

export default function Topbar({
    user,
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
}: TopbarProps) {
    const router = useRouter();
    const { breadcrumbs } = useBreadcrumbs(); // Get breadcrumbs from context
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Example notification count
    const notificationCount = 3;

    // Just first letter of user's first name
    const userInitial = user.name ? user.name[0].toUpperCase() : '?';

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        router.push("/");
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileMenu = () => {
        // Direct state update - no timeout needed
        setIsMobileOpen(!isMobileOpen);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close mobile menu when screen resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobileOpen, setIsMobileOpen]);

    return (
        <header
            id="mobile-topbar"
            className={`fixed top-0 right-0 z-30 bg-white h-14 shadow-sm px-3 sm:px-4 flex items-center justify-between transition-all duration-300
                ${isMobileOpen ? "left-60" : isCollapsed ? "left-0 lg:left-14" : "left-0 lg:left-60"}`}
        >
            <div className="flex items-center">
                {/* Mobile menu toggle button - improved visibility */}
                <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#09A08D] hover:bg-gray-100 mr-2 relative focus:outline-none"
                    aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={isMobileOpen}
                    aria-controls="mobile-sidebar"
                >
                    {isMobileOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <div className="relative">
                            <Menu className="h-5 w-5" />
                            {/* Small indicator to show there's a menu */}
                            <span className="absolute -top-1 -right-1 bg-[#09A08D] w-2 h-2 rounded-full"></span>
                        </div>
                    )}
                </button>

                {/* Desktop sidebar collapse toggle */}
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-2"
                    aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Modernized & Minimalist Breadcrumbs section */}
            {breadcrumbs.length > 0 && (
                <div className="hidden md:flex items-center overflow-x-auto whitespace-nowrap px-2 flex-1 ml-2">
                    <nav aria-label="Breadcrumb" className="flex">
                        <ol className="flex items-center">
                            {breadcrumbs.map((breadcrumb, index) => (
                                <li key={index} className="flex items-center">
                                    {index > 0 && (
                                        <div className="mx-1 text-gray-300">
                                            <ChevronRight className="h-3 w-3" />
                                        </div>
                                    )}

                                    {breadcrumb.href ? (
                                        <Link
                                            href={breadcrumb.href}
                                            className={`text-xs rounded px-1.5 py-0.5 transition-all duration-200 ${index === breadcrumbs.length - 1
                                                ? "font-medium text-[#09A08D]"
                                                : "text-gray-500 hover:text-gray-700"
                                                }`}
                                        >
                                            {breadcrumb.label}
                                        </Link>
                                    ) : (
                                        <span className={`text-xs px-1.5 py-0.5 ${index === breadcrumbs.length - 1
                                            ? "font-medium text-[#09A08D]"
                                            : "text-gray-500"
                                            }`}>
                                            {breadcrumb.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            )}

            <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Notifications dropdown - hidden on mobile */}
                <div className="relative hidden sm:block" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="p-2 rounded-full text-gray-500 hover:text-[#09A08D] hover:bg-gray-100 relative"
                        aria-label="Notificações"
                    >
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Notificações</h3>
                                <span className="bg-[#09A08D] text-white text-xs px-2 py-1 rounded-full">
                                    {notificationCount} novas
                                </span>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                                            <UserIcon className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-700">Novo usuário cadastrado</p>
                                            <p className="text-xs text-gray-500 mt-1">Há 5 minutos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                                            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-700">Novo cliente adicionado</p>
                                            <p className="text-xs text-gray-500 mt-1">Há 1 hora</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                                            <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-700">Alerta de sistema</p>
                                            <p className="text-xs text-gray-500 mt-1">Ontem</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100">
                                <Link
                                    href="/dashboard/notifications"
                                    className="text-sm text-[#09A08D] font-medium hover:underline block text-center"
                                >
                                    Ver todas as notificações
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* User profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 pl-2 pr-2 sm:pr-3 py-1.5 rounded-full transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 group"
                    >
                        <div className="w-8 h-8 bg-[#09A08D] rounded-full flex items-center justify-center text-white font-medium shadow-md ring-2 ring-white group-hover:shadow-lg transition-all">
                            {userInitial}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-[#09A08D] transition-colors">
                                {user.name}
                            </p>
                            <p className="text-xs font-medium text-[#09A08D]">
                                {user.role}
                            </p>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block" />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                            {/* User Header */}
                            <div className="px-5 py-4 bg-gradient-to-r from-[#09A08D]/10 to-white border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-[#09A08D] rounded-full flex items-center justify-center text-white font-medium text-lg shadow-md ring-2 ring-white">
                                        {userInitial}
                                    </div>
                                    <div className="ml-3 overflow-hidden">
                                        <p className="text-base font-semibold text-gray-800 truncate">{user.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#09A08D] text-white">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Options */}
                            <div className="py-2 px-1">
                                <div className="px-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Conta
                                </div>

                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#09A08D] rounded-md mx-1 group transition-colors"
                                >
                                    <UserIcon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-[#09A08D]" />
                                    <span>Meu Perfil</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#09A08D] rounded-md mx-1 group transition-colors"
                                >
                                    <Cog className="h-4 w-4 mr-3 text-gray-400 group-hover:text-[#09A08D]" />
                                    <span>Configurações</span>
                                </Link>

                                {user.role === "ADMIN" && (
                                    <Link
                                        href="/dashboard/admin"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#09A08D] rounded-md mx-1 group transition-colors"
                                    >
                                        <Shield className="h-4 w-4 mr-3 text-gray-400 group-hover:text-[#09A08D]" />
                                        <span>Administração</span>
                                    </Link>
                                )}
                            </div>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-5 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 group transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-3 text-gray-400 group-hover:text-red-500" />
                                <span>Sair do sistema</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
