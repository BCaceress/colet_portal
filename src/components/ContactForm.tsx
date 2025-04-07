import { Contact } from "@/types/contact";
import { useEffect, useState } from "react";

interface ContactFormProps {
    contact?: Contact;
    onSubmit: (contactData: Omit<Contact, "id_contato">) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ContactForm({
    contact,
    onSubmit,
    onCancel,
    isLoading = false
}: ContactFormProps) {
    const [formData, setFormData] = useState<Omit<Contact, "id_contato">>({
        ds_nome: "",
        ds_cargo: "",
        ds_email: "",
        ds_telefone: "",
        fl_ativo: true,
        fl_whatsapp: false,
        tx_observacoes: "",
        id_cliente: undefined
    });

    useEffect(() => {
        if (contact) {
            const { id_contato, ...contactData } = contact;
            setFormData(contactData);
        }
    }, [contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="ds_nome" className="block text-sm font-medium text-gray-700">
                    Nome*
                </label>
                <input
                    type="text"
                    id="ds_nome"
                    name="ds_nome"
                    required
                    value={formData.ds_nome}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D]"
                />
            </div>

            <div>
                <label htmlFor="ds_cargo" className="block text-sm font-medium text-gray-700">
                    Cargo*
                </label>
                <input
                    type="text"
                    id="ds_cargo"
                    name="ds_cargo"
                    required
                    value={formData.ds_cargo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D]"
                />
            </div>

            <div>
                <label htmlFor="ds_email" className="block text-sm font-medium text-gray-700">
                    Email*
                </label>
                <input
                    type="email"
                    id="ds_email"
                    name="ds_email"
                    required
                    value={formData.ds_email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D]"
                />
            </div>

            <div>
                <label htmlFor="ds_telefone" className="block text-sm font-medium text-gray-700">
                    Telefone*
                </label>
                <input
                    type="text"
                    id="ds_telefone"
                    name="ds_telefone"
                    required
                    value={formData.ds_telefone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D]"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="fl_whatsapp"
                    name="fl_whatsapp"
                    checked={formData.fl_whatsapp}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#09A08D] focus:ring-[#09A08D]"
                />
                <label htmlFor="fl_whatsapp" className="ml-2 block text-sm text-gray-700">
                    Possui WhatsApp
                </label>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="fl_ativo"
                    name="fl_ativo"
                    checked={formData.fl_ativo}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#09A08D] focus:ring-[#09A08D]"
                />
                <label htmlFor="fl_ativo" className="ml-2 block text-sm text-gray-700">
                    Ativo
                </label>
            </div>

            <div>
                <label htmlFor="tx_observacoes" className="block text-sm font-medium text-gray-700">
                    Observações
                </label>
                <textarea
                    id="tx_observacoes"
                    name="tx_observacoes"
                    rows={3}
                    value={formData.tx_observacoes || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D]"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09A08D]"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#09A08D] hover:bg-[#3C787A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09A08D]"
                    disabled={isLoading}
                >
                    {isLoading ? "Salvando..." : contact ? "Atualizar" : "Criar"}
                </button>
            </div>
        </form>
    );
}
