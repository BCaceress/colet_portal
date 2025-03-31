"use client";

import { registerUser } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(""); // New state for role selection
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Field validation states
    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [roleValid, setRoleValid] = useState(true); // New validation state for role
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Available roles
    const roles = [
        { value: "suporte", label: "Suporte" },
        { value: "implantacao", label: "Implantação" },
        { value: "desenvolvimento", label: "Desenvolvimento" },
        { value: "analista", label: "Analistas" },
        { value: "admin", label: "Administradores" }
    ];

    // Validate email format
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Calculate password strength
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [password]);

    // Validate form fields as user types
    useEffect(() => {
        if (name) setNameValid(name.length >= 3);
        if (email) setEmailValid(validateEmail(email));
        if (password) setPasswordValid(password.length >= 8);
        if (confirmPassword) setConfirmPasswordValid(password === confirmPassword);
        if (role) setRoleValid(!!role);
    }, [name, email, password, confirmPassword, role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Comprehensive validation
        if (name.length < 3) {
            setError("Nome deve ter pelo menos 3 caracteres");
            setNameValid(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Email inválido");
            setEmailValid(false);
            return;
        }

        if (password.length < 8) {
            setError("Senha deve ter pelo menos 8 caracteres");
            setPasswordValid(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            setConfirmPasswordValid(false);
            return;
        }

        if (!role) {
            setError("Selecione uma permissão");
            setRoleValid(false);
            return;
        }

        setLoading(true);

        try {
            // Updated to include role in registration
            await registerUser(name, email, password, role);
            setSuccess("Cadastro realizado com sucesso!");
            setTimeout(() => {
                router.push("/?registered=true");
            }, 1500);
        } catch (err) {
            setError("Erro ao cadastrar usuário. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#09A08D] to-[#3C787A] p-4 sm:p-6 md:p-8">
            <div className="m-auto w-full max-w-md">
                <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
                    <div className="bg-[#49BC99] px-6 py-8 text-center">
                        <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full bg-[#3A3A3A] p-2 shadow-md">
                            <Image
                                src="/images/logoColet.png"
                                alt="Colet Logo"
                                width={150}
                                height={150}
                                priority
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/vercel.svg"; // Fallback if logo isn't available
                                }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Colet Sistemas</h1>
                        <p className="mt-1 text-sm text-white/90">Cadastro de Novo Usuário</p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 rounded-md bg-green-50 p-3">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div className="text-sm text-green-700">{success}</div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#3A3A3A]">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        aria-required="true"
                                        aria-invalid={!nameValid}
                                        required
                                        className={`block w-full rounded-md border ${nameValid ? 'border-gray-300 focus:border-[#09A08D]' : 'border-red-300 focus:border-red-500'
                                            } px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-1 ${nameValid ? 'focus:ring-[#09A08D]' : 'focus:ring-red-500'
                                            } sm:text-sm transition-all duration-200 text-black`}
                                        placeholder="Seu nome completo"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setNameValid(e.target.value.length >= 3 || e.target.value.length === 0);
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${nameValid ? 'text-gray-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {!nameValid && name && (
                                    <p className="mt-1 text-xs text-red-600">Nome deve ter pelo menos 3 caracteres</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A]">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        aria-required="true"
                                        aria-invalid={!emailValid}
                                        required
                                        className={`block w-full rounded-md border ${emailValid ? 'border-gray-300 focus:border-[#09A08D]' : 'border-red-300 focus:border-red-500'
                                            } px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-1 ${emailValid ? 'focus:ring-[#09A08D]' : 'focus:ring-red-500'
                                            } sm:text-sm transition-all duration-200 text-black`}
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailValid(validateEmail(e.target.value) || e.target.value.length === 0);
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${emailValid ? 'text-gray-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                {!emailValid && email && (
                                    <p className="mt-1 text-xs text-red-600">Formato de email inválido</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#3A3A3A]">
                                    Senha <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        aria-required="true"
                                        aria-invalid={!passwordValid}
                                        required
                                        className={`block w-full rounded-md border ${passwordValid ? 'border-gray-300 focus:border-[#09A08D]' : 'border-red-300 focus:border-red-500'
                                            } px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-1 ${passwordValid ? 'focus:ring-[#09A08D]' : 'focus:ring-red-500'
                                            } sm:text-sm transition-all duration-200 text-black`}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordValid(e.target.value.length >= 8 || e.target.value.length === 0);
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${passwordValid ? 'text-gray-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                                {password && (
                                    <div className="mt-1">
                                        <div className="flex h-1 w-full space-x-1">
                                            <div className={`h-full w-1/4 rounded-full ${passwordStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                                            <div className={`h-full w-1/4 rounded-full ${passwordStrength >= 2 ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
                                            <div className={`h-full w-1/4 rounded-full ${passwordStrength >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                                            <div className={`h-full w-1/4 rounded-full ${passwordStrength >= 4 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600">
                                            {passwordStrength === 0 && "Senha muito fraca"}
                                            {passwordStrength === 1 && "Senha fraca"}
                                            {passwordStrength === 2 && "Senha média"}
                                            {passwordStrength === 3 && "Senha forte"}
                                            {passwordStrength === 4 && "Senha muito forte"}
                                        </p>
                                    </div>
                                )}
                                {!passwordValid && password && (
                                    <p className="mt-1 text-xs text-red-600">Senha deve ter pelo menos 8 caracteres</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3A3A3A]">
                                    Confirmar Senha <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        aria-required="true"
                                        aria-invalid={!confirmPasswordValid}
                                        required
                                        className={`block w-full rounded-md border ${confirmPasswordValid ? 'border-gray-300 focus:border-[#09A08D]' : 'border-red-300 focus:border-red-500'
                                            } px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-1 ${confirmPasswordValid ? 'focus:ring-[#09A08D]' : 'focus:ring-red-500'
                                            } sm:text-sm transition-all duration-200 text-black`}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setConfirmPasswordValid(e.target.value === password || e.target.value.length === 0);
                                        }}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${confirmPasswordValid ? 'text-gray-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                </div>
                                {!confirmPasswordValid && confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600">As senhas não coincidem</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-[#3A3A3A]">
                                    Permissão <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        id="role"
                                        name="role"
                                        aria-required="true"
                                        aria-invalid={!roleValid}
                                        required
                                        className={`block w-full rounded-md border ${roleValid ? 'border-gray-300 focus:border-[#09A08D]' : 'border-red-300 focus:border-red-500'
                                            } px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-1 ${roleValid ? 'focus:ring-[#09A08D]' : 'focus:ring-red-500'
                                            } sm:text-sm transition-all duration-200 text-black`}
                                        value={role}
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            setRoleValid(!!e.target.value);
                                        }}
                                    >
                                        <option value="">Selecione uma permissão</option>
                                        {roles.map((roleOption) => (
                                            <option key={roleOption.value} value={roleOption.value}>
                                                {roleOption.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${roleValid ? 'text-gray-400' : 'text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                </div>
                                {!roleValid && (
                                    <p className="mt-1 text-xs text-red-600">Selecione uma permissão</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-[#09A08D] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3C787A] focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 disabled:bg-[#09A08D]/70"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cadastrando...
                                        </span>
                                    ) : (
                                        "Cadastrar"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-[#3A3A3A]">
                                Já tem uma conta?{" "}
                                <Link href="/" className="font-medium text-[#09A08D] hover:text-[#3C787A] transition-colors">
                                    Faça login
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <p className="text-center text-xs text-gray-600">
                            © {new Date().getFullYear()} Colet Sistemas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
