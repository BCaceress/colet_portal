"use client";

import AddClientModal from "@/components/clients/AddClientModal";
import DeleteClientModal from "@/components/clients/DeleteClientModal";
import Sidebar from "@/components/layout/Sidebar";
import { getUserInfo } from "@/services/authService";
import { createClient, deleteClient, getClients } from "@/services/clientService";
import { User } from "@/types/auth";
import { Client } from "@/types/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Add search state
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);

    // Add state for showing inactive clients
    const [showInactive, setShowInactive] = useState(false);

    // Add loading states for submission and deletion
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Add success message state
    const [successMessage, setSuccessMessage] = useState("");

    // Add state to track expanded client rows
    const [expandedClients, setExpandedClients] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Check if user is logged in by verifying token exists
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/");
            return;
        }

        // Fetch user data and clients using the token
        const fetchData = async () => {
            try {
                const userData = await getUserInfo(token);
                if (userData) {
                    setUser(userData);

                    // Fetch clients after user data is loaded
                    const clientsData = await getClients(token);
                    setClients(clientsData);
                } else {
                    // Invalid token or error fetching user data
                    localStorage.removeItem("accessToken");
                    router.push("/");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Falha ao carregar dados. Por favor, tente novamente.");
                localStorage.removeItem("accessToken");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        // Sort and filter clients based on searchTerm and showInactive state
        let filtered = [...clients].sort((a, b) =>
            a.ds_nome.localeCompare(b.ds_nome)
        );

        // Filter by active status if not showing inactive
        if (!showInactive) {
            filtered = filtered.filter(client => client.fl_ativo);
        }

        // Apply search term filter if exists
        if (searchTerm.trim()) {
            filtered = filtered.filter(client =>
                client.ds_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.ds_razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.nr_cnpj.includes(searchTerm) ||
                client.ds_cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.ds_uf?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredClients(filtered);
    }, [searchTerm, clients, showInactive]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleAddClient = async (newClient: any) => {
        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/");
                return;
            }

            const addedClient = await createClient(token, newClient);
            setClients([...clients, addedClient]);
            setIsAddModalOpen(false);

            // Show success notification
            setSuccessMessage("Cliente adicionado com sucesso!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error adding client:", err);
            setError("Falha ao adicionar cliente. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDeleteClient = (client: Client) => {
        setSelectedClient(client);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteClient = async () => {
        if (!selectedClient) return;

        setIsDeleting(true);
        setError("");

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/");
                return;
            }

            await deleteClient(token, selectedClient.id_cliente);
            setClients(clients.filter(client => client.id_cliente !== selectedClient.id_cliente));
            setIsDeleteModalOpen(false);
            setSelectedClient(null);

            // Show success notification
            setSuccessMessage("Cliente excluído com sucesso!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error deleting client:", err);
            setError("Falha ao excluir cliente. Por favor, tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    const viewClientDetails = (client: Client) => {
        setSelectedClient(client);
        setIsViewModalOpen(true);
    };

    // Improved CNPJ formatter with input mask
    const formatCNPJ = (value: string) => {
        // Remove any non-digit characters
        const cnpj = value.replace(/\D/g, '');

        // Apply mask: XX.XXX.XXX/XXXX-XX
        if (cnpj.length <= 2) {
            return cnpj;
        } else if (cnpj.length <= 5) {
            return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
        } else if (cnpj.length <= 8) {
            return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
        } else if (cnpj.length <= 12) {
            return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
        } else {
            return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
        }
    };

    // Function to toggle client expansion
    const toggleClientExpansion = (clientId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedClients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(clientId)) {
                newSet.delete(clientId);
            } else {
                newSet.add(clientId);
            }
            return newSet;
        });
    };

    // Component to display contacts when expanded
    const ClientContactsRow = ({ client, isExpanded }: { client: Client; isExpanded: boolean }) => {
        if (!isExpanded || !client.contatos || client.contatos.length === 0) {
            return null;
        }

        return (
            <tr>
                <td colSpan={6} className="px-0 py-0">
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Contatos</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Cargo
                                        </th>
                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Telefone
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {client.contatos.map((contact) => (
                                        <tr key={contact.id_contato}>
                                            <td className="px-6 py-2 text-sm text-gray-900">
                                                {contact.ds_nome}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-900">
                                                {contact.ds_cargo || "-"}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-900">
                                                {contact.ds_email ? (
                                                    <a href={`mailto:${contact.ds_email}`} className="text-blue-600 hover:underline">
                                                        {contact.ds_email}
                                                    </a>
                                                ) : "-"}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-900">
                                                {contact.ds_telefone || "-"}
                                                {contact.fl_whatsapp && contact.ds_telefone && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        WhatsApp
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        );
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
                        <h1 className="text-2xl font-semibold text-[#3A3A3A]">Clientes</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
                            <div className="bg-green-50 p-4 rounded-md shadow-lg border-l-4 border-green-500 flex items-center">
                                <svg className="h-6 w-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-700">{successMessage}</span>
                                <button
                                    className="ml-4 text-green-700 hover:text-green-900"
                                    onClick={() => setSuccessMessage("")}
                                >
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                            <div>
                                <h2 className="text-lg font-medium text-[#3A3A3A]">Lista de Clientes</h2>
                                <p className="text-sm text-gray-500">
                                    {searchTerm
                                        ? `${filteredClients.length} resultados encontrados`
                                        : `Total de clientes: ${filteredClients.length}`
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                                <div className="relative w-full md:w-64">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#09A08D] focus:border-[#09A08D] block w-full pl-10 p-2.5"
                                        placeholder="Buscar clientes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="show-inactive"
                                        type="checkbox"
                                        checked={showInactive}
                                        onChange={(e) => setShowInactive(e.target.checked)}
                                        className="w-4 h-4 text-[#09A08D] bg-gray-100 border-gray-300 rounded focus:ring-[#09A08D]"
                                    />
                                    <label htmlFor="show-inactive" className="ml-2 text-sm font-medium text-gray-700">
                                        Mostrar inativos
                                    </label>
                                </div>

                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center justify-center rounded-md bg-[#09A08D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3C787A] focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 md:ml-auto"
                                >
                                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Adicionar Cliente
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Razão Social
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Nome Fantasia
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            CNPJ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Cidade
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            UF
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredClients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                {searchTerm || showInactive ? "Nenhum cliente encontrado para esta busca" : "Nenhum cliente cadastrado"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <>
                                                <tr key={client.id_cliente} className={`hover:bg-gray-50 ${!client.fl_ativo ? 'bg-gray-100' : ''}`}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            {/* Add expand button if client has contacts */}
                                                            {client.contatos && client.contatos.length > 0 && (
                                                                <button
                                                                    onClick={(e) => toggleClientExpansion(client.id_cliente, e)}
                                                                    className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                                                    title={expandedClients.has(client.id_cliente) ? "Ocultar contatos" : "Mostrar contatos"}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-5 w-5 transition-transform ${expandedClients.has(client.id_cliente) ? 'rotate-90' : ''}`}
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            {client.ds_nome}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {client.ds_razao_social || "-"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {formatCNPJ(client.nr_cnpj)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {client.ds_cidade || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {client.ds_uf || "-"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                        <div className="flex justify-center space-x-3">
                                                            <button
                                                                onClick={() => viewClientDetails(client)}
                                                                className="text-blue-600 hover:text-blue-900 focus:outline-none"
                                                                title="Ver detalhes"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDeleteClient(client)}
                                                                className="text-red-600 hover:text-red-900 focus:outline-none"
                                                                title="Excluir cliente"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Render contacts row if expanded */}
                                                <ClientContactsRow
                                                    key={`contacts-${client.id_cliente}`}
                                                    client={client}
                                                    isExpanded={expandedClients.has(client.id_cliente)}
                                                />
                                            </>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-gray-200 bg-white py-4">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-xs text-gray-600">
                            © {new Date().getFullYear()} Colet Sistemas.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Use imported AddClientModal component */}
            <AddClientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddClient}
                isSubmitting={isSubmitting}
            />

            {/* Use imported DeleteClientModal component */}
            {selectedClient && (
                <DeleteClientModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteClient}
                    client={selectedClient}
                    isDeleting={isDeleting}
                />
            )}

            {/* Client Details Modal */}
            {isViewModalOpen && selectedClient && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity duration-300"
                            aria-hidden="true"
                            onClick={() => setIsViewModalOpen(false)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
                            <div className="bg-white px-5 pt-5 pb-4 sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <svg className="h-7 w-7 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900">Detalhes do Cliente</h3>
                                    </div>
                                </div>

                                <div className="mt-6 max-h-[60vh] overflow-y-auto px-1 py-2">
                                    <div className="divide-y divide-gray-200">
                                        <div className="py-4">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">Identificação</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Razão Social</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_nome}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Nome Fantasia</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_razao_social || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatCNPJ(selectedClient.nr_cnpj)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Inscrição Estadual</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.nr_inscricao_estadual || "-"}</dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Site</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedClient.ds_site ? (
                                                            <a href={selectedClient.ds_site} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                {selectedClient.ds_site}
                                                            </a>
                                                        ) : "-"}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="py-4">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">Contrato</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Situação</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_situacao || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Sistema</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_sistema || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Contrato</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_contrato || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Valor Hora Técnica</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedClient.nr_hora_tecnica ? `R$ ${parseFloat(selectedClient.nr_hora_tecnica).toFixed(2)}` : "-"}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="py-4">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">Localização</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">UF</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_uf || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Cidade</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_cidade || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Bairro</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_bairro || "-"}</dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedClient.ds_endereco || "-"}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        {selectedClient.ds_observacao && (
                                            <div className="py-4">
                                                <h4 className="text-lg font-medium text-gray-900 mb-3">Observações</h4>
                                                <p className="text-sm text-gray-900 whitespace-pre-line">{selectedClient.ds_observacao}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-5 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 transition-colors sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsViewModalOpen(false)}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
