import { Client } from "@/types/client";
import React from "react";

interface DeleteClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>;
    client: Client;
    isDeleting: boolean;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    client,
    isDeleting
}) => {
    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm transition-all duration-300">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                    aria-hidden="true"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-fadeIn sm:w-full">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-red-600/10 to-white px-6 py-4 flex items-center border-b border-gray-100">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mr-4">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Excluir Cliente</h3>
                            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
                        </div>
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors"
                            onClick={onClose}
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="px-6 py-5">
                        <div className="space-y-4">
                            <p className="text-base text-gray-600">
                                Tem certeza que deseja excluir o cliente:
                            </p>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                                <p className="text-lg font-medium text-gray-900">
                                    {client.ds_razao_social}
                                </p>
                                {client.ds_nome && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {client.ds_nome}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition-colors"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Excluindo...</span>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Excluir Cliente</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteClientModal;
