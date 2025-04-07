"use client";

import AnimatedSvgIllustration from "@/components/AnimatedSvgIllustration";
import { loginUser } from "@/services/authService";
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos");
      setLoading(false);
      return;
    }

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
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Section - With SVG illustrations */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#09A08D] to-[#3C787A] flex-col justify-center items-center px-12 py-8 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="w-full max-w-xl mx-auto flex justify-center items-center h-full relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="transform transition duration-500 hover:scale-105 w-full"
          >
            <AnimatedSvgIllustration />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative h-22 w-full mb-6">
              <Image
                src="/images/logoColetHorizontal.png"
                alt="Colet Logo"
                layout="fill"
                objectFit="contain"
                priority
                onError={(e) => {
                  e.currentTarget.src = "/vercel.svg";
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 rounded-lg bg-red-50 p-4"
                role="alert"
              >
                <div className="flex items-center">
                  <FiAlertCircle className="mr-3 h-5 w-5 text-red-500" />
                  <div className="text-sm font-medium text-red-700">{error}</div>
                </div>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`flex items-center border ${formSubmitted && !email ? 'border-red-300 bg-red-50' : 'border-gray-300 focus-within:border-[#09A08D] focus-within:ring-1 focus-within:ring-[#09A08D]'} rounded-lg px-4 py-3 transition-all duration-200`}
                >
                  <FiMail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={formSubmitted && !email ? "true" : "false"}
                    className="w-full border-none bg-transparent focus:ring-0 outline-none text-gray-900 placeholder-gray-500 text-sm"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
                {formSubmitted && !email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-600"
                  >
                    Email é obrigatório
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`flex items-center border ${formSubmitted && !password ? 'border-red-300 bg-red-50' : 'border-gray-300 focus-within:border-[#09A08D] focus-within:ring-1 focus-within:ring-[#09A08D]'} rounded-lg px-4 py-3 transition-all duration-200`}
                >
                  <FiLock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    aria-invalid={formSubmitted && !password ? "true" : "false"}
                    className="w-full border-none bg-transparent focus:ring-0 outline-none text-gray-900 placeholder-gray-500 text-sm"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </motion.div>
                {formSubmitted && !password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-600"
                  >
                    Senha é obrigatória
                  </motion.p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#09A08D]"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-gradient-to-r from-[#09A08D] to-[#3C787A] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#09A08D] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-live="polite"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Entrando...</span>
                    </span>
                  ) : (
                    <span>Entrar</span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500">
              {new Date().getFullYear()} Colet Sistemas. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}