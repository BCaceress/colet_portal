import { API_URL } from "@/constants/api";
import { Rat } from '@/types/rat';



export async function getRats(token: string): Promise<Rat[]> {
    try {
        const response = await fetch(`${API_URL}/rats`, {
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
        console.error("Failed to fetch rats:", error);
        throw error;
    }

};

export async function getRatById(token: string, id: number): Promise<Rat[]> {
    try {
        const response = await fetch(`${API_URL}/rats/${id}`, {
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
        console.error("Failed to fetch rat:", error);
        throw error;
    }
};

export async function createRat(token: string, ratData: Partial<Rat>): Promise<Rat> {
    try {
        const response = await fetch(`${API_URL}/rats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ratData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create rat:", error);
        throw error;
    }
};

export async function updateRat(token: string, id: number, ratData: Partial<Rat>): Promise<Rat> {
    try {
        const response = await fetch(`${API_URL}/rats/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ratData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to update rat:", error);
        throw error;
    }
};

export async function deleteRat(token: string, id: number): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/rats/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to delete rat:", error);
        throw error;
    }
};
