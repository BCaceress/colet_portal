import { getUserInfo } from '@/services/authService';
import { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    router.push("/");
                    return;
                }

                const userData = await getUserInfo(token);
                if (userData) {
                    setUser(userData);
                } else {
                    // Invalid token or error fetching user data
                    localStorage.removeItem("accessToken");
                    router.push("/");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Authentication failed. Please log in again.");
                localStorage.removeItem("accessToken");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        router.push("/");
    };

    return { user, loading, error, logout };
}
