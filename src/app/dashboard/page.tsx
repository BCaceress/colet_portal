"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/");
            return;
        }

        try {
            const userData = JSON.parse(storedUser) as User;
            setUser(userData);
        } catch (err) {
            router.push("/");
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-[#09A08D]">Carregando...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar user={user} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-semibold text-[#3A3A3A]">Dashboard</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Stats Cards */}
                        <div className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-[1.02]">
                            <div className="flex items-center">
                                <div className="mr-4 rounded-full bg-[#09A08D]/10 p-3">
                                    <svg className="h-8 w-8 text-[#09A08D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Perfil</p>
                                    <p className="text-2xl font-semibold text-[#3A3A3A]">{user.nome}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-[1.02]">
                            <div className="flex items-center">
                                <div className="mr-4 rounded-full bg-[#09A08D]/10 p-3">
                                    <svg className="h-8 w-8 text-[#09A08D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Função</p>
                                    <p className="text-2xl font-semibold text-[#3A3A3A]">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-[1.02]">
                            <div className="flex items-center">
                                <div className="mr-4 rounded-full bg-[#09A08D]/10 p-3">
                                    <svg className="h-8 w-8 text-[#09A08D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Data de Admissão</p>
                                    <p className="text-2xl font-semibold text-[#3A3A3A]">{user.dataAdmissao}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                        <h2 className="text-lg font-medium text-[#3A3A3A]">Informações do Usuário</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-md bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">ID</p>
                                <p className="mt-1 text-[#3A3A3A]">{user.id}</p>
                            </div>
                            <div className="rounded-md bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">Nome</p>
                                <p className="mt-1 text-[#3A3A3A]">{user.nome}</p>
                            </div>
                            <div className="rounded-md bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="mt-1 text-[#3A3A3A]">{user.email}</p>
                            </div>
                            <div className="rounded-md bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-500">Função</p>
                                <p className="mt-1 text-[#3A3A3A]">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Section */}
                    {user.role === "ADMINISTRADOR" && (
                        <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
                            <h2 className="text-lg font-medium text-[#3A3A3A]">Área do Administrador</h2>
                            <div className="mt-4 rounded-md bg-[#49BC99]/10 p-4">
                                <p className="text-[#3A3A3A]">Esta seção é visível apenas para administradores.</p>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <button className="rounded-md bg-[#09A08D] px-4 py-2 text-white shadow-sm hover:bg-[#3C787A]">
                                        Gerenciar Usuários
                                    </button>
                                    <button className="rounded-md bg-[#09A08D] px-4 py-2 text-white shadow-sm hover:bg-[#3C787A]">
                                        Configurações do Sistema
                                    </button>
                                    <button className="rounded-md bg-[#09A08D] px-4 py-2 text-white shadow-sm hover:bg-[#3C787A]">
                                        Logs do Sistema
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="border-t border-gray-200 bg-white py-4">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-xs text-gray-600">
                            © {new Date().getFullYear()} Colet Sistemas.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
