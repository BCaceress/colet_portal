import { User } from "@/types/auth";

const API_URL = "http://localhost:3001/";

export async function loginUser(email: string, password: string): Promise<User | null> {
    try {
        // Fetch users from the API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const users: User[] = await response.json();

        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.senha === password);

        if (user) {
            // Update lastAccess time
            const updatedUser = {
                ...user,
                ultimoAcesso: new Date().toISOString()
            };

            return updatedUser;
        }

        return null;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function registerUser(nome: string, email: string, senha: string, role: string): Promise<void> {
    try {
        // Create form data
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
