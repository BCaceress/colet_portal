import { Client } from "@/types/client";
import { API_URL } from "@/config/constants";

export async function getClients(token: string): Promise<Client[]> {
    try {
        const response = await fetch(`${API_URL}clients`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch clients");
        }

        const clients = await response.json();
        return clients;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
}

export async function createClient(token: string, client: Omit<Client, 'id_client'>): Promise<Client> {
    try {
        const response = await fetch(`${API_URL}clients`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create client");
        }

        const newClient = await response.json();
        return newClient;
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
}

export async function deleteClient(token: string, clientId: number): Promise<void> {
    try {
        const response = await fetch(`${API_URL}clients/${clientId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete client");
        }

        return Promise.resolve();
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
}
