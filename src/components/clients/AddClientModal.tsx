import React, { useState } from "react";

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (client: any) => Promise<void>;
    isSubmitting: boolean;
}

// Interface for ViaCEP API response
interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    erro?: boolean;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd, isSubmitting }) => {
    const [error, setError] = useState("");
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [cepError, setCepError] = useState("");

    const initialClientState = {
        ds_nome: "",
        ds_razao_social: "",
        nr_cnpj: "",
        nr_inscricao_estadual: "",
        ds_site: "",
        tx_observacoes: "",
        fl_ativo: true,
        ds_cep: "",
        ds_uf: "",
        ds_cidade: "",
        ds_bairro: "",
        ds_endereco: "",
        nr_numero: "",
        ds_complemento: "",
        nr_codigo_ibge: "",
        nr_latitude: "",
        nr_longitude: "",
        nr_distancia_km: ""
    };

    const [newClient, setNewClient] = useState(initialClientState);

    const resetForm = () => {
        setNewClient(initialClientState);
        setError("");
        setCepError("");
        setIsLoadingCep(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Function to fetch address data from CEP using ViaCEP API
    const fetchAddressFromCEP = async (cep: string) => {
        if (!cep || cep.length !== 8) return;

        try {
            setIsLoadingCep(true);
            setCepError("");
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data: ViaCEPResponse = await response.json();

            if (data.erro) {
                setCepError("CEP não encontrado");
                return;
            }

            setNewClient(prev => ({
                ...prev,
                ds_endereco: data.logradouro || prev.ds_endereco,
                ds_bairro: data.bairro || prev.ds_bairro,
                ds_cidade: data.localidade || prev.ds_cidade,
                ds_uf: data.uf || prev.ds_uf,
                ds_complemento: data.complemento || prev.ds_complemento,
                nr_codigo_ibge: data.ibge || prev.nr_codigo_ibge
            }));
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            setCepError("Erro ao buscar o CEP. Tente novamente.");
        } finally {
            setIsLoadingCep(false);
        }
    };

    const handleSubmit = async () => {
        if (!newClient.ds_nome || !newClient.nr_cnpj) {
            setError("Nome e CNPJ são obrigatórios");
            return;
        }

        await onAdd(newClient);
    };

    const formatCNPJ = (value: string) => {
        const cnpj = value.replace(/\D/g, '');

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

    const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) {
            value = value.slice(0, 14);
        }

        const formattedValue = formatCNPJ(value);
        setNewClient({ ...newClient, nr_cnpj: value });
        e.target.value = formattedValue;
    };

    const formatCEP = (value: string) => {
        const cep = value.replace(/\D/g, '');

        if (cep.length <= 5) {
            return cep;
        } else {
            return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
        }
    };

    const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        const formattedValue = formatCEP(value);
        setNewClient({ ...newClient, ds_cep: value });
        e.target.value = formattedValue;

        // If we have a complete CEP, fetch address data
        if (value.length === 8) {
            fetchAddressFromCEP(value);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNewClient({ ...newClient, [name]: checked });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/70 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 transition-opacity duration-300"
                    aria-hidden="true"
                    onClick={handleClose}
                >
                </div>

                <div className="relative w-full max-w-5xl transform overflow-hidden rounded-xl bg-gray-800 shadow-2xl transition-all duration-300 animate-fadeIn sm:w-full border border-gray-700">
                    <div className="border-b border-gray-700 bg-gradient-to-r from-[#09A08D]/20 to-gray-800 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#09A08D]/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#09A08D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold leading-6 text-gray-100">Adicionar Novo Cliente</h3>
                        </div>
                        <button
                            type="button"
                            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#09A08D]/50 transition-colors"
                            onClick={handleClose}
                        >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 pt-6">
                        {error && (
                            <div className="mb-5 rounded-lg bg-red-900/30 p-3 border-l-4 border-red-500 animate-fadeIn">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm font-medium text-red-300">{error}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-6">
                        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-5 transition-all duration-300 animate-fadeIn">
                                {/* INFORMAÇÕES GERAIS */}
                                <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-md font-medium text-gray-300 border-b border-gray-700 pb-2 mb-4">Informações do Cliente</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {/* Nome e Status */}
                                        <div className="md:col-span-8">
                                            <label htmlFor="ds_nome" className="block text-sm font-medium text-gray-300 mb-1">
                                                Nome <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="ds_nome"
                                                id="ds_nome"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.ds_nome}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Nome do cliente"
                                            />
                                        </div>
                                        <div className="md:col-span-4 flex items-center md:mt-0 md:justify-end">
                                            <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative inline-flex items-center">
                                                        <input
                                                            id="fl_ativo"
                                                            name="fl_ativo"
                                                            type="checkbox"
                                                            checked={newClient.fl_ativo}
                                                            onChange={handleCheckboxChange}
                                                            className="opacity-0 absolute h-6 w-6 cursor-pointer"
                                                        />
                                                        <div className={`border-2 rounded-md h-6 w-6 flex flex-shrink-0 justify-center items-center mr-2 ${newClient.fl_ativo ? 'bg-[#09A08D] border-[#09A08D]' : 'border-gray-500 bg-gray-700'}`}>
                                                            <svg className={`fill-current w-3 h-3 text-white pointer-events-none ${newClient.fl_ativo ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 20 20">
                                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label htmlFor="fl_ativo" className="block text-sm font-medium text-gray-300 select-none cursor-pointer">
                                                                Cliente ativo
                                                            </label>
                                                            <span className="text-xs text-gray-500">Ativo no sistema</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Razão Social e CNPJ */}
                                        <div className="md:col-span-6">
                                            <label htmlFor="ds_razao_social" className="block text-sm font-medium text-gray-300 mb-1">
                                                Razão Social
                                            </label>
                                            <input
                                                type="text"
                                                name="ds_razao_social"
                                                id="ds_razao_social"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.ds_razao_social}
                                                onChange={handleInputChange}
                                                placeholder="Razão social do cliente"
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <label htmlFor="nr_cnpj" className="block text-sm font-medium text-gray-300 mb-1">
                                                CNPJ <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nr_cnpj"
                                                id="nr_cnpj"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                placeholder="00.000.000/0000-00"
                                                value={formatCNPJ(newClient.nr_cnpj)}
                                                onChange={handleCNPJChange}
                                                maxLength={18}
                                                required
                                            />
                                        </div>

                                        {/* Inscrição Estadual e Site */}
                                        <div className="md:col-span-6">
                                            <label htmlFor="nr_inscricao_estadual" className="block text-sm font-medium text-gray-300 mb-1">
                                                Inscrição Estadual
                                            </label>
                                            <input
                                                type="text"
                                                name="nr_inscricao_estadual"
                                                id="nr_inscricao_estadual"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.nr_inscricao_estadual}
                                                onChange={handleInputChange}
                                                placeholder="Número de inscrição"
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <label htmlFor="ds_site" className="block text-sm font-medium text-gray-300 mb-1">
                                                Site
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03-3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="ds_site"
                                                    id="ds_site"
                                                    placeholder="exemplo.com"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.ds_site}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Observações */}
                                        <div className="md:col-span-12">
                                            <label htmlFor="tx_observacoes" className="block text-sm font-medium text-gray-300 mb-1">
                                                Observações
                                            </label>
                                            <textarea
                                                name="tx_observacoes"
                                                id="tx_observacoes"
                                                rows={3}
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm resize-none transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.tx_observacoes}
                                                onChange={handleInputChange}
                                                placeholder="Informações adicionais sobre o cliente"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* LOCALIZAÇÃO */}
                                <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-md font-medium text-gray-300 border-b border-gray-700 pb-2 mb-4">Localização</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {/* CEP com autofill */}
                                        <div className="md:col-span-4">
                                            <label htmlFor="ds_cep" className="block text-sm font-medium text-gray-300 mb-1">
                                                CEP
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="ds_cep"
                                                    id="ds_cep"
                                                    className={`block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2 ${isLoadingCep ? 'opacity-70' : ''}`}
                                                    value={formatCEP(newClient.ds_cep)}
                                                    onChange={handleCEPChange}
                                                    placeholder="00000-000"
                                                    maxLength={9}
                                                    disabled={isLoadingCep}
                                                />
                                                {isLoadingCep && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <svg className="animate-spin h-4 w-4 text-[#09A08D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            {cepError ? (
                                                <p className="mt-1 text-xs text-red-400">{cepError}</p>
                                            ) : (
                                                <p className="mt-1 text-xs text-gray-500">Digite apenas números</p>
                                            )}
                                        </div>

                                        {/* Estado e Cidade */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="ds_uf" className="block text-sm font-medium text-gray-300 mb-1">
                                                UF
                                            </label>
                                            <input
                                                type="text"
                                                name="ds_uf"
                                                id="ds_uf"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm uppercase transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                maxLength={2}
                                                value={newClient.ds_uf}
                                                onChange={handleInputChange}
                                                placeholder="SP"
                                                disabled={isLoadingCep}
                                            />
                                        </div>
                                        <div className="md:col-span-6">
                                            <label htmlFor="ds_cidade" className="block text-sm font-medium text-gray-300 mb-1">
                                                Cidade
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="ds_cidade"
                                                    id="ds_cidade"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.ds_cidade}
                                                    onChange={handleInputChange}
                                                    placeholder="Nome da cidade"
                                                    disabled={isLoadingCep}
                                                />
                                            </div>
                                        </div>

                                        {/* Endereço, Número e Complemento */}
                                        <div className="md:col-span-7">
                                            <label htmlFor="ds_endereco" className="block text-sm font-medium text-gray-300 mb-1">
                                                Endereço
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="ds_endereco"
                                                    id="ds_endereco"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.ds_endereco}
                                                    onChange={handleInputChange}
                                                    placeholder="Rua, avenida, etc."
                                                    disabled={isLoadingCep}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="nr_numero" className="block text-sm font-medium text-gray-300 mb-1">
                                                Número
                                            </label>
                                            <input
                                                type="text"
                                                name="nr_numero"
                                                id="nr_numero"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.nr_numero}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label htmlFor="ds_complemento" className="block text-sm font-medium text-gray-300 mb-1">
                                                Complemento
                                            </label>
                                            <input
                                                type="text"
                                                name="ds_complemento"
                                                id="ds_complemento"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.ds_complemento}
                                                onChange={handleInputChange}
                                                placeholder="Apto, sala, etc."
                                            />
                                        </div>

                                        {/* Bairro */}
                                        <div className="md:col-span-5">
                                            <label htmlFor="ds_bairro" className="block text-sm font-medium text-gray-300 mb-1">
                                                Bairro
                                            </label>
                                            <input
                                                type="text"
                                                name="ds_bairro"
                                                id="ds_bairro"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.ds_bairro}
                                                onChange={handleInputChange}
                                                placeholder="Nome do bairro"
                                                disabled={isLoadingCep}
                                            />
                                        </div>
                                        <div className="md:col-span-7">
                                            <label htmlFor="nr_codigo_ibge" className="block text-sm font-medium text-gray-300 mb-1">
                                                Código IBGE
                                            </label>
                                            <input
                                                type="text"
                                                name="nr_codigo_ibge"
                                                id="nr_codigo_ibge"
                                                className="block w-full rounded-lg border-gray-600 bg-gray-700 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                value={newClient.nr_codigo_ibge}
                                                onChange={handleInputChange}
                                                placeholder="Código IBGE do município"
                                                disabled={isLoadingCep}
                                            />
                                        </div>

                                        {/* Coordenadas e Distância */}
                                        <div className="md:col-span-4">
                                            <label htmlFor="nr_latitude" className="block text-sm font-medium text-gray-300 mb-1">
                                                Latitude
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="nr_latitude"
                                                    id="nr_latitude"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.nr_latitude}
                                                    onChange={handleInputChange}
                                                    placeholder="-23.5505"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-4">
                                            <label htmlFor="nr_longitude" className="block text-sm font-medium text-gray-300 mb-1">
                                                Longitude
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="nr_longitude"
                                                    id="nr_longitude"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.nr_longitude}
                                                    onChange={handleInputChange}
                                                    placeholder="-46.6333"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-4">
                                            <label htmlFor="nr_distancia_km" className="block text-sm font-medium text-gray-300 mb-1">
                                                Distância (km)
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="nr_distancia_km"
                                                    id="nr_distancia_km"
                                                    className="block w-full rounded-lg border-gray-600 bg-gray-700 pl-10 shadow-sm focus:border-[#09A08D] focus:ring-[#09A08D] sm:text-sm transition-all hover:border-gray-500 text-gray-100 px-3 py-2"
                                                    value={newClient.nr_distancia_km}
                                                    onChange={handleInputChange}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-700">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#09A08D] to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-[#078275] hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
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
                                    <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Salvar Cliente
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClientModal;