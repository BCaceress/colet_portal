import { Client } from '@/types/client';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

// Type for client creation payload
export interface CreateClientPayload {
    ds_nome: string;
    ds_razao_social?: string;
    nr_cnpj: string;
    nr_inscricao_estadual?: string;
    fl_ativo: boolean;
    // ...other fields
}

/**
 * Get all clients
 */
export const getClients = async (token: string): Promise<Client[]> => {
    return apiGet<Client[]>('/clients', token);
};

/**
 * Get client by ID
 */
export const getClientById = async (token: string, id: number): Promise<Client> => {
    return apiGet<Client>(`/clients/${id}`, token);
};

/**
 * Create a new client
 */
export const createClient = async (token: string, clientData: CreateClientPayload): Promise<Client> => {
    return apiPost<Client>('/clients', clientData, token);
};

/**
 * Update an existing client
 */
export const updateClient = async (token: string, id: number, clientData: Partial<Client>): Promise<Client> => {
    return apiPut<Client>(`/clients/${id}`, clientData, token);
};

/**
 * Delete a client
 */
export const deleteClient = async (token: string, id: number): Promise<void> => {
    return apiDelete(`/clients/${id}`, token);
};
