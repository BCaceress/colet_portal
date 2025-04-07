"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getUserInfo } from "@/services/authService";
import { createContact, getContacts } from "@/services/contactService";
import { User } from "@/types/auth";
import { Contact } from "@/types/contact";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ContactsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Drawer states
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
    const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");

    // Add state for showing inactive contacts
    const [showInactive, setShowInactive] = useState(false);

    // Loading states for submission and deletion
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Success message state
    const [successMessage, setSuccessMessage] = useState("");

    // View mode (table or cards for mobile)
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");

    // Add new filter states
    const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "recent" | "email">("name_asc");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [clientFilter, setClientFilter] = useState<string>("");

    useEffect(() => {
        // Check if user is logged in by verifying token exists
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/");
            return;
        }

        // Set view mode based on screen width
        const handleResize = () => {
            setViewMode(window.innerWidth < 768 ? "cards" : "table");
        };

        // Set initial view mode
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Fetch user data and contacts using the token
        const fetchData = async () => {
            try {
                const userData = await getUserInfo(token);
                if (userData) {
                    setUser(userData);

                    // Fetch contacts after user data is loaded
                    const contactsData = await getContacts(token);
                    setContacts(contactsData);
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

        // Clean up event listener
        return () => window.removeEventListener('resize', handleResize);
    }, [router]);

    const filteredContacts = useMemo(() => {
        // Sort and filter contacts based on searchTerm and showInactive state
        let filtered = [...contacts];

        // Apply sorting with more options
        switch (sortBy) {
            case "name_asc":
                filtered.sort((a, b) => a.ds_nome.localeCompare(b.ds_nome));
                break;
            case "name_desc":
                filtered.sort((a, b) => b.ds_nome.localeCompare(a.ds_nome));
                break;
            case "email":
                filtered.sort((a, b) => a.ds_email.localeCompare(b.ds_email));
                break;
            case "recent":
                // Since we don't have timestamp properties, we'll sort by ID if available
                // assuming higher IDs are more recent entries
                filtered.sort((a, b) => {
                    const idA = a.id_contato || 0;
                    const idB = b.id_contato || 0;
                    return idB - idA;  // Sort in descending order (newest first)
                });
                break;
        }

        // Filter by active status if not showing inactive
        if (!showInactive) {
            filtered = filtered.filter(contact => contact.fl_ativo);
        }

        // Filter by role if role filter is set
        if (roleFilter) {
            filtered = filtered.filter(contact =>
                contact.ds_cargo && contact.ds_cargo.toLowerCase().includes(roleFilter.toLowerCase())
            );
        }

        // Filter by client if client filter is set
        if (clientFilter) {
            filtered = filtered.filter(contact =>
                contact.clientes && contact.clientes.some(client =>
                    client.ds_nome.toLowerCase().includes(clientFilter.toLowerCase())
                )
            );
        }

        // Apply search term filter if exists
        if (searchTerm.trim()) {
            filtered = filtered.filter(contact =>
                contact.ds_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.ds_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.ds_cargo && contact.ds_cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact.ds_telefone && contact.ds_telefone.includes(searchTerm))
            );
        }

        return filtered;
    }, [searchTerm, contacts, showInactive, roleFilter, sortBy, clientFilter]);

    const openAddDrawer = () => {
        setSelectedContact(null);
        setIsAddDrawerOpen(true);
    };

    const openEditDrawer = (contact: Contact) => {
        setSelectedContact(contact);
        setIsEditDrawerOpen(true);
    };

    const handleAddContact = async (newContact: Contact) => {
        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/");
                return;
            }

            const addedContact = await createContact(token, newContact);
            setContacts([...contacts, addedContact]);
            setIsAddDrawerOpen(false);

            // Show success notification
            setSuccessMessage("Contato adicionado com sucesso!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error adding contact:", err);
            setError("Falha ao adicionar contato. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const viewContactDetails = (contact: Contact) => {
        setSelectedContact(contact);
        setIsViewDrawerOpen(true);
    };

    // Format phone number
    const formatPhoneNumber = (value: string) => {
        if (!value) return "-";

        // Remove non-digits
        const phone = value.replace(/\D/g, '');

        // Apply Brazilian phone format
        if (phone.length <= 2) {
            return phone;
        } else if (phone.length <= 6) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
        } else if (phone.length <= 10) {
            return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
        } else {
            return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
        }
    };

    // Helper function to format client list as a string
    const formatClientList = (contact: Contact) => {
        if (!contact.clientes || contact.clientes.length === 0) {
            return "-";
        }

        // If only one client, return its name
        if (contact.clientes.length === 1) {
            return contact.clientes[0].ds_nome;
        }

        // If multiple clients, return first one with a '+N' indicator
        return `${contact.clientes[0].ds_nome} +${contact.clientes.length - 1}`;
    };

    if (loading) {
        return <LoadingSpinner message="Carregando contatos..." />;
    }

    if (!user) return null;

    // Extract unique clients for filter dropdown
    const uniqueClients = Array.from(
        new Set(
            contacts
                .flatMap(contact => contact.clientes || [])
                .map(client => client.ds_nome)
        )
    ).sort();

    return (
        <DashboardLayout user={user}>
            {/* Success toast notification */}
            {successMessage && (
                <div className="fixed top-5 right-5 z-50 animate-fade-in-down">
                    <div className="bg-white p-4 rounded-lg shadow-xl border-l-4 border-green-500 flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-gray-800 font-medium">{successMessage}</span>
                        <button
                            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setSuccessMessage("")}
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-500 shadow-sm animate-fade-in">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm font-medium text-red-700">{error}</div>
                    </div>
                </div>
            )}

            {/* Redesigned Contacts Control Panel */}
            <div className="mb-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header section */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Lista de Contatos</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {searchTerm || roleFilter || clientFilter
                                        ? `${filteredContacts.length} resultados encontrados`
                                        : `Total de contatos: ${filteredContacts.length}`
                                    }
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                                    className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                    aria-label={viewMode === "table" ? "Mudar para visualização em cartões" : "Mudar para visualização em tabela"}
                                >
                                    {viewMode === "table" ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Cards
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                            Tabela
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={openAddDrawer}
                                    className="inline-flex items-center justify-center rounded-md bg-[#09A08D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#078275] focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 transition-colors"
                                >
                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Adicionar Contato
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search and filters section */}
                    <div className="p-5 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Search input - takes more space */}
                            <div className="md:col-span-8 lg:col-span-8">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#09A08D] focus:border-[#09A08D] block w-full pl-10 p-2.5 transition-colors"
                                        placeholder="Buscar por nome, email, cargo ou telefone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Sort dropdown */}
                            <div className="md:col-span-3 lg:col-span-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as "name_asc" | "name_desc" | "recent" | "email")}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#09A08D] focus:border-[#09A08D] block w-full p-2.5 transition-colors"
                                >
                                    <option value="name_asc">Nome (A-Z)</option>
                                    <option value="name_desc">Nome (Z-A)</option>
                                    <option value="email">Email</option>
                                    <option value="recent">Mais Recentes</option>
                                </select>
                            </div>

                            {/* Client filter - new */}
                            <div className="md:col-span-3 lg:col-span-2">
                                <select
                                    value={clientFilter}
                                    onChange={(e) => setClientFilter(e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#09A08D] focus:border-[#09A08D] block w-full p-2.5 transition-colors"
                                >
                                    <option value="">Todos os Clientes</option>
                                    {uniqueClients.map(client => (
                                        <option key={client} value={client}>{client}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active filters and inactive toggle in single row */}
                        <div className="mt-4 flex flex-wrap items-center justify-between">
                            {/* Show active filters */}
                            <div className="flex flex-wrap gap-2 items-center">
                                {(searchTerm || roleFilter || clientFilter) ? (
                                    <>
                                        <div className="text-sm text-gray-500 mr-2">Filtros ativos:</div>

                                        {searchTerm && (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                Busca: {searchTerm}
                                                <button
                                                    onClick={() => setSearchTerm("")}
                                                    className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-blue-400 hover:bg-blue-200"
                                                >
                                                    <span className="sr-only">Remover filtro</span>
                                                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}

                                        {roleFilter && (
                                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                                                Cargo: {roleFilter}
                                                <button
                                                    onClick={() => setRoleFilter("")}
                                                    className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-purple-400 hover:bg-purple-200"
                                                >
                                                    <span className="sr-only">Remover filtro</span>
                                                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}

                                        {clientFilter && (
                                            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                                                Cliente: {clientFilter}
                                                <button
                                                    onClick={() => setClientFilter("")}
                                                    className="ml-1.5 inline-flex items-center justify-center rounded-full h-4 w-4 text-amber-400 hover:bg-amber-200"
                                                >
                                                    <span className="sr-only">Remover filtro</span>
                                                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setRoleFilter("");
                                                setClientFilter("");
                                            }}
                                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                                        >
                                            Limpar todos
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-500">Sem filtros ativos</div>
                                )}
                            </div>

                            {/* Show inactive toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showInactive}
                                    onChange={(e) => setShowInactive(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#09A08D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#09A08D]"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Mostrar inativos
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Cliente(s)
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                                        Cargo
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                                        Telefone
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-gray-800 font-medium">
                                                    {searchTerm || showInactive || clientFilter ? "Nenhum contato encontrado para esta busca" : "Nenhum contato cadastrado"}
                                                </p>
                                                <button
                                                    onClick={openAddDrawer}
                                                    className="inline-flex items-center justify-center rounded-md bg-[#09A08D] px-4 py-2 mt-2 text-sm font-medium text-white shadow-sm hover:bg-[#078275]"
                                                >
                                                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Adicionar Contato
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <tr key={contact.id_contato}
                                            className={`hover:bg-gray-50 transition-colors ${!contact.fl_ativo ? 'bg-gray-50' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {contact.ds_nome}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {contact.clientes && contact.clientes.length > 0 ? (
                                                    <div className="flex items-center">
                                                        <span>{formatClientList(contact)}</span>
                                                        {contact.clientes.length > 1 && (
                                                            <span
                                                                className="ml-1 cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                                onClick={() => viewContactDetails(contact)}
                                                            >

                                                            </span>
                                                        )}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                                                {contact.ds_cargo || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <a href={`mailto:${contact.ds_email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                                    {contact.ds_email}
                                                </a>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                                                {contact.ds_telefone ? (
                                                    <div className="flex items-center">
                                                        <a href={`tel:${contact.ds_telefone}`} className="hover:text-blue-600 transition-colors">
                                                            {formatPhoneNumber(contact.ds_telefone)}
                                                        </a>
                                                        {contact.fl_whatsapp && (
                                                            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                                <svg className="mr-1 h-3 w-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M12 2C6.486 2 2 6.486 2 12c0 1.666.414 3.244 1.147 4.632L2 22l5.4-1.412C8.768 21.504 10.338 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.469 0-2.858-.352-4.094-.971L5.5 19.719l.797-2.39C5.578 16.063 5 14.106 5 12c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7z" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm hidden sm:table-cell">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.fl_ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${contact.fl_ativo ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                    {contact.fl_ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => viewContactDetails(contact)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                                        title="Ver detalhes"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openEditDrawer(contact)}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                                                        title="Editar contato"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Card View (for mobile) */}
            {viewMode === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContacts.length === 0 ? (
                        <div className="col-span-full p-6 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-800 font-medium text-center mb-3">
                                {searchTerm || showInactive || clientFilter ? "Nenhum contato encontrado para esta busca" : "Nenhum contato cadastrado"}
                            </p>
                            <button
                                onClick={openAddDrawer}
                                className="inline-flex items-center justify-center rounded-md bg-[#09A08D] px-4 py-2 mt-2 text-sm font-medium text-white shadow-sm hover:bg-[#078275]"
                            >
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Adicionar Contato
                            </button>
                        </div>
                    ) : (
                        filteredContacts.map((contact) => (
                            <div
                                key={contact.id_contato}
                                className={`bg-white rounded-xl shadow-sm border ${!contact.fl_ativo ? 'border-red-100' : 'border-gray-200'} overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-md`}
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                {contact.ds_nome}
                                            </h3>
                                            {contact.ds_cargo && (
                                                <p className="text-sm text-gray-600 mb-2">{contact.ds_cargo}</p>
                                            )}
                                        </div>
                                        {contact.fl_ativo ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                                Ativo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                                Inativo
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <a href={`mailto:${contact.ds_email}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                                {contact.ds_email}
                                            </a>
                                        </div>

                                        {contact.ds_telefone && (
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div className="flex items-center">
                                                    <a href={`tel:${contact.ds_telefone}`} className="text-sm text-gray-600 hover:text-blue-600">
                                                        {formatPhoneNumber(contact.ds_telefone)}
                                                    </a>
                                                    {contact.fl_whatsapp && (
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                            <svg className="mr-1 h-3 w-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2C6.486 2 2 6.486 2 12c0 1.666.414 3.244 1.147 4.632L2 22l5.4-1.412C8.768 21.504 10.338 22 12 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.469 0-2.858-.352-4.094-.971L5.5 19.719l.797-2.39C5.578 16.063 5 14.106 5 12c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7z" />
                                                            </svg>
                                                            WhatsApp
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {contact.clientes && contact.clientes.length > 0 && (
                                            <div className="flex items-start">
                                                <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <div>
                                                    <span className="text-sm text-gray-600">{formatClientList(contact)}</span>
                                                    {contact.clientes.length > 1 && (
                                                        <span
                                                            className="ml-1 cursor-pointer text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                            onClick={() => viewContactDetails(contact)}
                                                        >

                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 border-t border-gray-100 px-5 py-3">
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => viewContactDetails(contact)}
                                            className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Detalhes
                                        </button>

                                        <button
                                            onClick={() => openEditDrawer(contact)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                            title="Editar contato"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
