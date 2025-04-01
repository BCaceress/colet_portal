import { User } from "@/types/auth";
import { API_URL } from "@/config/constants";

export async function loginUser(email: string, password: string): Promise<{ accessToken: string } | null> {
    try {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch(`${API_URL}auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function getUserInfo(token: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}

export async function registerUser(nome: string, email: string, senha: string, role: string): Promise<void> {
    try {
        const formData = new URLSearchParams();
        formData.append('name', nome);
        formData.append('email', email);
        formData.append('password', senha);
        formData.append('role', role);

        const response = await fetch(`${API_URL}auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed");
        }

        return Promise.resolve();
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}
