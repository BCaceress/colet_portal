"use client";

import { User } from "@/types/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
    user: User;
}

export default function Sidebar({ user }: SidebarProps) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    const menuItems = [
        { name: "Dashboard", icon: "📊", path: "/dashboard" },
        { name: "Perfil", icon: "👤", path: "/dashboard/profile" },
        ...(user?.role === "ADMINISTRADOR"
            ? [{ name: "Administração", icon: "⚙️", path: "/dashboard/admin" }]
            : []),
        { name: "Relatórios", icon: "📈", path: "/dashboard/reports" },
    ];

    return (
        <div
            className={`flex h-screen flex-col bg-white shadow-md transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}>
                    <Image
                        src="/images/logoColet.png"
                        alt="Colet Logo"
                        width={40}
                        height={40}
                        className="mr-2"
                        onError={(e) => {
                            e.currentTarget.src = "/vercel.svg";
                        }}
                    />
                    {!isCollapsed && <h1 className="text-lg font-bold text-[#3A3A3A]">Colet Sistemas</h1>}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`text-gray-500 hover:text-[#09A08D] ${isCollapsed ? "hidden" : ""}`}
                >
                    {isCollapsed ? "›" : "‹"}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-[#09A08D]/10 hover:text-[#09A08D]"
                            >
                                <span className="mr-3 text-xl">{item.icon}</span>
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-200 p-4">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    {!isCollapsed && (
                        <div className="overflow-hidden text-ellipsis">
                            <p className="text-sm font-medium text-gray-700">{user.nome}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="rounded-full bg-[#09A08D] p-2 text-white hover:bg-[#3C787A]"
                        title="Sair"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
