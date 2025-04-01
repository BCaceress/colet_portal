"use client";

import { loginUser } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError("");
    setLoading(true);

    try {
      const authData = await loginUser(email, password);
      if (authData && authData.accessToken) {
        // Store token in localStorage
        localStorage.setItem("accessToken", authData.accessToken);
        router.push("/dashboard");
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#09A08D] to-[#3C787A]">
      <div className="m-auto w-full max-w-md px-4 py-8 sm:px-6 md:max-w-lg">
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <div className="bg-[#49BC99] px-6 py-8 text-center">
            <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full bg-[#3A3A3A] p-2 shadow-md transition-transform duration-300 hover:scale-105">
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
            <h1 className="text-2xl font-bold text-white md:text-3xl">Colet Sistemas</h1>
            <p className="mt-1 text-sm text-white/90 md:text-base">Portal de Acesso</p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 animate-fadeIn" role="alert">
                <div className="flex items-center">
                  <FiAlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  <div className="text-sm font-medium text-red-700">{error}</div>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3A3A3A]">
                  Email
                </label>
                <div className="mt-1 relative rounded-md">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={formSubmitted && !email ? "true" : "false"}
                    className={`block w-full rounded-md border ${formSubmitted && !email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#09A08D] focus:ring-[#09A08D]'
                      } px-3 py-2 shadow-sm outline-none ring-opacity-50 transition-all duration-200 focus:ring-1 sm:text-sm text-black`}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formSubmitted && !email && (
                    <p className="mt-1 text-xs text-red-600">Email é obrigatório</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-[#3A3A3A]">
                    Senha
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#09A08D] hover:text-[#3C787A] transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <div className="mt-1 relative rounded-md">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    aria-invalid={formSubmitted && !password ? "true" : "false"}
                    className={`block w-full rounded-md border ${formSubmitted && !password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#09A08D] focus:ring-[#09A08D]'
                      } px-3 py-2 pr-10 shadow-sm outline-none ring-opacity-50 transition-all duration-200 focus:ring-1 sm:text-sm text-black`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                  {formSubmitted && !password && (
                    <p className="mt-1 text-xs text-red-600">Senha é obrigatória</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-[#09A08D] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#3C787A] focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 disabled:bg-[#09A08D]/70 disabled:cursor-not-allowed transform  active:translate-y-0"
                  aria-live="polite"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </span>
                  ) : "Entrar"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-[#3A3A3A]">
                Ainda não tem uma conta?{" "}
                <Link href="/register" className="font-medium text-[#09A08D] hover:text-[#3C787A] transition-colors">
                  Cadastre-se
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
