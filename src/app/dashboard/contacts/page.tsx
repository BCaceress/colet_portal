"use client";

import Sidebar from "@/components/Sidebar";
import { getUserInfo } from "@/services/authService";
import { Contact, getContacts } from "@/services/contactService";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Contacts() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in by verifying token exists
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/");
            return;
        }

        // Fetch user data and contacts
        const fetchData = async () => {
            try {
                // Get user data
                const userData = await getUserInfo(token);
                if (!userData) {
                    localStorage.removeItem("accessToken");
                    router.push("/");
                    return;
                }
                setUser(userData);

                // Get contacts
                const contactsData = await getContacts(token);
                setContacts(contactsData);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Falha ao carregar contatos. Por favor, tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleRetry = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/");
                return;
            }
            const contactsData = await getContacts(token);
            setContacts(contactsData);
        } catch (err) {
            console.error("Error retrying contacts fetch:", err);
            setError("Falha ao carregar contatos. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-2xl font-semibold text-[#3A3A3A]">Contatos</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {error ? (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={handleRetry}
                                        className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                                    >
                                        Tentar novamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="rounded-lg bg-white p-6 text-center shadow-md">
                            <p className="text-gray-500">Nenhum contato encontrado.</p>
                            <button
                                className="mt-4 rounded-md bg-[#09A08D] px-4 py-2 text-white hover:bg-[#3C787A]"
                                onClick={() => {/* Implement add contact functionality */ }}
                            >
                                Adicionar Contato
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="flex justify-between px-6 py-4">
                                <h2 className="text-lg font-medium text-[#3A3A3A]">Lista de Contatos</h2>
                                <button
                                    className="rounded-md bg-[#09A08D] px-4 py-2 text-white hover:bg-[#3C787A]"
                                    onClick={() => {/* Implement add contact functionality */ }}
                                >
                                    Adicionar Contato
                                </button>
                            </div>
                            <div className="border-t border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cargo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Telefone</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {contacts.map((contact) => (
                                            <tr key={contact.id_contato}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{contact.ds_nome}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">{contact.ds_cargo}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">{contact.ds_email}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        {contact.ds_telefone}
                                                        {contact.fl_whatsapp && (
                                                            <span className="ml-2 text-green-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                                                    <path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 1.87.518 3.61 1.416 5.111l-1.702 5.113 5.296-1.414c1.431.795 3.071 1.25 4.819 1.25h.004c5.518 0 9.998-4.48 9.998-10.001 0-2.669-1.04-5.182-2.929-7.071-1.889-1.889-4.4-2.927-7.068-2.928h-.005z" />
                                                                    <path d="M17.291 14.517l-1.449-.698c-.608-.293-1.099-.106-1.429.199-.329.304-.767.618-1.231.344-.462-.273-1.776-.915-3.017-2.156-1.24-1.242-1.881-2.556-2.154-3.019-.274-.463.042-.902.346-1.231.304-.33.49-.822.199-1.429-.291-.606-.695-1.447-.697-1.449-.298-.616-.911-.918-1.514-.917-.613 0-1.188.337-1.483.882-.203.375-.596 1.095-.596 2.688 0 1.594 1.163 3.138 1.323 3.352.16.214 2.055 3.273 5.096 4.719 3.037 1.447 3.08 1.084 3.637 1.085.558 0 1.797-.632 2.05-1.241.255-.61.255-1.13.179-1.239-.076-.109-.277-.174-.577-.298z" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${contact.fl_ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {contact.fl_ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    <button className="mr-2 text-indigo-600 hover:text-indigo-900">Editar</button>
                                                    <button className="text-red-600 hover:text-red-900">Excluir</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
