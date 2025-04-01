import { Contact } from "@/types/contact";
import React, { useEffect, useState } from "react";
import CustomJobTitleSelect from "../CargosSelect";

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (contact: Contact) => Promise<void>;
    isSubmitting: boolean;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onAdd, isSubmitting }) => {
    const [error, setError] = useState("");
    const initialContactState: Contact = {
        ds_nome: "",
        ds_email: "",
        ds_cargo: "",
        ds_telefone: "",
        fl_ativo: true,
        fl_whatsapp: false,
        tx_observacoes: ""
    };

    const [newContact, setNewContact] = useState<Contact>(initialContactState);

    // Reset form when modal is opened or closed
    useEffect(() => {
        if (!isOpen) {
            // Small delay to avoid visible reset before the modal disappears
            const timer = setTimeout(() => {
                resetForm();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const resetForm = () => {
        setNewContact(initialContactState);
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!newContact.ds_nome) {
            setError("Nome é obrigatório");
            return;
        }

        if (!newContact.ds_email) {
            setError("Email é obrigatório");
            return;
        }

        if (!validateEmail(newContact.ds_email)) {
            setError("Email inválido");
            return;
        }

        await onAdd(newContact);
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const formatPhoneNumber = (value: string) => {
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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        const formattedValue = formatPhoneNumber(value);
        setNewContact({ ...newContact, ds_telefone: value });
        e.target.value = formattedValue;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewContact({ ...newContact, [name]: value });
    };

    const handleJobTitleChange = (value: string) => {
        setNewContact({ ...newContact, ds_cargo: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNewContact({ ...newContact, [name]: checked });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 transition-opacity duration-300"
                    aria-hidden="true"
                    onClick={handleClose}
                >
                </div>

                <div className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-fadeIn sm:w-full">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-[#09A08D]/10 to-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#09A08D]/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#09A08D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">Adicionar Novo Contato</h3>
                        </div>
                        <button
                            type="button"
                            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#09A08D]/50 transition-colors"
                            onClick={handleClose}
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 py-6">
                        {error && (
                            <div className="mb-5 rounded-lg bg-red-50 p-3 border-l-4 border-red-500 animate-fadeIn">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm font-medium text-red-700">{error}</div>
                                </div>
                            </div>
                        )}

                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-5 transition-all duration-300">
                                <div>
                                    <label htmlFor="ds_nome" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ds_nome"
                                        id="ds_nome"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400"
                                        value={newContact.ds_nome}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ds_email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="ds_email"
                                        id="ds_email"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400"
                                        value={newContact.ds_email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ds_cargo" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cargo
                                    </label>
                                    <CustomJobTitleSelect
                                        value={newContact.ds_cargo}
                                        onChange={handleJobTitleChange}
                                        placeholder="Selecione ou digite o cargo"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ds_telefone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        name="ds_telefone"
                                        id="ds_telefone"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400"
                                        onChange={handlePhoneChange}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="fl_whatsapp"
                                        id="fl_whatsapp"
                                        className="h-4 w-4 rounded border-gray-300 text-[#09A08D] focus:ring-[#09A08D]"
                                        checked={newContact.fl_whatsapp}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="fl_whatsapp" className="text-sm text-gray-700">
                                        Este número possui WhatsApp
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="fl_ativo"
                                        id="fl_ativo"
                                        className="h-4 w-4 rounded border-gray-300 text-[#09A08D] focus:ring-[#09A08D]"
                                        checked={newContact.fl_ativo}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor="fl_ativo" className="text-sm text-gray-700">
                                        Contato Ativo
                                    </label>
                                </div>

                                <div>
                                    <label htmlFor="tx_observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Observações
                                    </label>
                                    <textarea
                                        name="tx_observacoes"
                                        id="tx_observacoes"
                                        rows={3}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-400 resize-none"
                                        value={newContact.tx_observacoes}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-1 transition-colors"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#09A08D] to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#078275] hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Adicionar Contato
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddContactModal;
