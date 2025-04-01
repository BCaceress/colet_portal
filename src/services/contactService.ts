import { API_URL } from "@/constants/api";
import { Contact } from "@/types/contact";

export async function getContacts(token: string): Promise<Contact[]> {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch contacts:", error);
        throw error;
    }
}

export async function getContactsByClient(token: string, clientId: number): Promise<Contact[]> {
    try {
        const response = await fetch(`${API_URL}/contacts/client/${clientId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch client contacts:", error);
        throw error;
    }
}

export async function createContact(token: string, contactData: Omit<Contact, "id_contato">): Promise<Contact> {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(contactData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create contact:", error);
        throw error;
    }
}
