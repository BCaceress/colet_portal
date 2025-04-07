export type UserRole = "ADMINISTRADOR" | "SUPORTE" | "DESENVOLVIMENTO" | "IMPLANTACAO" | "ANALISTA";

export interface User {
    id_usuario: number;
    nome: string;
    email: string;
    senha: string;
    funcao: string; // This replaces 'role', keeping UserRole type for backwards compatibility
}
