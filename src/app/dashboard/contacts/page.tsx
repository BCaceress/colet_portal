"use client";

import AddContactModal from "@/components/contacts/AddContactModal";
import DeleteContactModal from "@/components/contacts/DeleteContactModal";
import Sidebar from "@/components/layout/Sidebar";
import { getUserInfo } from "@/services/authService";
import { createContact, getContacts } from "@/services/contactService";
import { User } from "@/types/auth";
import { Contact } from "@/types/contact";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContactsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

    // Add state for showing inactive contacts
    const [showInactive, setShowInactive] = useState(false);

    // Loading states for submission and deletion
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Success message state
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        // Check if user is logged in by verifying token exists
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push("/");
            return;
        }

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
    }, [router]);

    useEffect(() => {
        // Sort and filter contacts based on searchTerm and showInactive state
        let filtered = [...contacts].sort((a, b) =>
            a.ds_nome.localeCompare(b.ds_nome)
        );

        // Filter by active status if not showing inactive
        if (!showInactive) {
            filtered = filtered.filter(contact => contact.fl_ativo);
        }

        // Apply search term filter if exists
        if (searchTerm.trim()) {
            filtered = filtered.filter(contact =>
                contact.ds_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.ds_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.ds_cargo && contact.ds_cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact.nr_telefone && contact.nr_telefone.includes(searchTerm))
            );
        }

        setFilteredContacts(filtered);
    }, [searchTerm, contacts, showInactive]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
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
            setIsAddModalOpen(false);

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

    const confirmDeleteContact = (contact: Contact) => {
        setSelectedContact(contact);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteContact = async () => {
        if (!selectedContact) return;

        setIsDeleting(true);
        setError("");

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                router.push("/");
                return;
            }

            await deleteContact(token, selectedContact.id_contato!);
            setContacts(contacts.filter(contact => contact.id_contato !== selectedContact.id_contato));
            setIsDeleteModalOpen(false);
            setSelectedContact(null);

            // Show success notification
            setSuccessMessage("Contato excluído com sucesso!");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (err) {
            console.error("Error deleting contact:", err);
            setError("Falha ao excluir contato. Por favor, tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    const viewContactDetails = (contact: Contact) => {
        setSelectedContact(contact);
        setIsViewModalOpen(true);
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
                                <h2 className="text-lg font-medium text-[#3A3A3A]">Lista de Contatos</h2>
                                <p className="text-sm text-gray-500">
                                    {searchTerm
                                        ? `${filteredContacts.length} resultados encontrados`
                                        : `Total de contatos: ${filteredContacts.length}`
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
                                        placeholder="Buscar contatos..."
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
                                    Adicionar Contato
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
                                            Nome
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Cliente
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Cargo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Telefone
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredContacts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                {searchTerm || showInactive ? "Nenhum contato encontrado para esta busca" : "Nenhum contato cadastrado"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredContacts.map((contact) => (
                                            <tr key={contact.id_contato} className={`hover:bg-gray-50 ${!contact.fl_ativo ? 'bg-gray-100' : ''}`}>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {contact.ds_nome}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {contact.cliente.ds_nome || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {contact.ds_cargo || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <a href={`mailto:${contact.ds_email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                        {contact.ds_email}
                                                    </a>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                    {contact.ds_telefone ? (
                                                        <div className="flex items-center">
                                                            <a href={`tel:${contact.ds_telefone}`} className="hover:text-blue-600">
                                                                {formatPhoneNumber(contact.ds_telefone)}
                                                            </a>
                                                            {contact.fl_whatsapp && (
                                                                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                                    WhatsApp
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${contact.fl_ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {contact.fl_ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-3">
                                                        <button
                                                            onClick={() => viewContactDetails(contact)}
                                                            className="text-blue-600 hover:text-blue-900 focus:outline-none"
                                                            title="Ver detalhes"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDeleteContact(contact)}
                                                            className="text-red-600 hover:text-red-900 focus:outline-none"
                                                            title="Excluir contato"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                </main>

                <footer className="border-t border-gray-200 bg-white py-4">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-xs text-gray-600">
                            © {new Date().getFullYear()} Colet Sistemas.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Use imported AddContactModal component */}
            <AddContactModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddContact}
                isSubmitting={isSubmitting}
            />

            {/* Use imported DeleteContactModal component */}
            {selectedContact && (
                <DeleteContactModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteContact}
                    contact={selectedContact}
                    isDeleting={isDeleting}
                />
            )}

            {/* Contact Details Modal - Updated to match clients format */}
            {isViewModalOpen && selectedContact && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity duration-300"
                            aria-hidden="true"
                            onClick={() => setIsViewModalOpen(false)}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block transform overflow-hidden rounded-xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-5 pt-5 pb-4 sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <svg className="h-7 w-7 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-xl font-semibold leading-6 text-gray-900">Detalhes do Contato</h3>
                                    </div>
                                </div>

                                <div className="mt-6 max-h-[60vh] overflow-y-auto px-1 py-2">
                                    <div className="divide-y divide-gray-200">
                                        <div className="py-4">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">Informações Gerais</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedContact.ds_nome}</dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        <a href={`mailto:${selectedContact.ds_email}`} className="text-blue-600 hover:underline">
                                                            {selectedContact.ds_email}
                                                        </a>
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Cargo</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedContact.ds_cargo || "-"}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                    <dd className="mt-1 text-sm">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${selectedContact.fl_ativo
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {selectedContact.fl_ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedContact.cliente.ds_nome || "-"}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="py-4">
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">Contato</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {selectedContact.ds_telefone ? (
                                                            <div className="flex items-center">
                                                                <a href={`tel:${selectedContact.ds_telefone}`} className="text-blue-600 hover:underline">
                                                                    {formatPhoneNumber(selectedContact.ds_telefone)}
                                                                </a>
                                                                {selectedContact.fl_whatsapp && (
                                                                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                                        WhatsApp
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : "-"}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Ramal</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{selectedContact.nr_ramal || "-"}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        {selectedContact.ds_descricao && (
                                            <div className="py-4">
                                                <h4 className="text-lg font-medium text-gray-900 mb-3">Descrição</h4>
                                                <p className="text-sm text-gray-900 whitespace-pre-line">{selectedContact.ds_descricao}</p>
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
