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
        {
            name: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>, path: "/dashboard"
        },
        {
            name: "Clientes", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>, path: "/dashboard/clients"
        },
        {
            name: "Contatos", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>, path: "/dashboard/contacts"
        },
    ];

    return (
        <div
            className={`flex h-screen flex-col bg-[#3A3A3A] text-white shadow-md transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
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
                    {!isCollapsed && <h1 className="text-lg font-bold text-white">Colet Sistemas</h1>}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`text-gray-400 hover:text-white absolute ${isCollapsed ? "right-2" : "right-4"}`}
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
                                className="flex items-center rounded-md px-4 py-3 text-gray-300 hover:bg-[#4A4A4A] hover:text-white transition-colors duration-200"
                            >
                                <span className="mr-3">{item.icon}</span>
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-gray-700 p-4">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    {!isCollapsed && (
                        <div className="overflow-hidden text-ellipsis">
                            <p className="text-sm font-medium text-gray-300">{user.name} <span className="text-xs text-gray-400">({user.role})</span></p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="rounded-full bg-[#09A08D] p-2 text-white hover:bg-[#078275] transition-colors duration-200"
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
